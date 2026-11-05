import { KenyaLocation, Product, Vendor } from "../types";

export interface AILocationMatchResult {
  vendorId: string;
  vendorName: string;
  stallLocation: string;
  location: KenyaLocation;
  matchScore: number;       // 0 - 100%
  distanceEstimate: string; // e.g. "0.4 km away (5 min walk)"
  proximityTier: "EXACT_ESTATE" | "SAME_TOWN" | "SAME_COUNTY" | "CROSS_COUNTY";
  aiReasoning: string;
  isOptimalChoice: boolean;
}

export interface AIProductMatch {
  product: Product;
  aiMatchScore: number;
  distanceLabel: string;
  aiBadge: string;
  aiSummary: string;
}

/**
 * Intelligent AI engine that matches buyer's current location with local verified vendor stalls in Kenya.
 */
export function aiMatchBuyerToVendors(
  buyerLoc: KenyaLocation,
  vendors: Vendor[]
): AILocationMatchResult[] {
  const buyerCounty = (buyerLoc.county || "").trim().toLowerCase();
  const buyerTown = (buyerLoc.town || "").trim().toLowerCase();
  const buyerEstate = (buyerLoc.estate || "").trim().toLowerCase();

  return vendors
    .map((v) => {
      const vCounty = (v.location.county || "").trim().toLowerCase();
      const vTown = (v.location.town || "").trim().toLowerCase();
      const vEstate = (v.location.estate || "").trim().toLowerCase();

      let matchScore = 40;
      let distanceEstimate = "Within Kenya";
      let proximityTier: AILocationMatchResult["proximityTier"] = "CROSS_COUNTY";
      let aiReasoning = "Vendor is available for regional dispatch.";

      if (vCounty === buyerCounty) {
        matchScore = 70;
        distanceEstimate = "Within county (~15-30 mins)";
        proximityTier = "SAME_COUNTY";
        aiReasoning = `Vendor located in ${v.location.county} County.`;

        if (vTown === buyerTown) {
          matchScore = 88;
          distanceEstimate = "~1.5 - 3 km (~10 mins)";
          proximityTier = "SAME_TOWN";
          aiReasoning = `Vendor is in your town (${v.location.town}). Fast local collection available.`;

          if (vEstate === buyerEstate) {
            matchScore = 99;
            distanceEstimate = "< 0.8 km (approx. 5 mins walk)";
            proximityTier = "EXACT_ESTATE";
            aiReasoning = `Direct neighborhood match! Located in ${v.location.estate}. Immediate pickup recommended.`;
          }
        }
      }

      return {
        vendorId: v.id,
        vendorName: v.businessName,
        stallLocation: v.stallNumber,
        location: v.location,
        matchScore,
        distanceEstimate,
        proximityTier,
        aiReasoning,
        isOptimalChoice: matchScore >= 88,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * AI Product Ranker: Combines token promotion with location proximity
 */
export function aiRankProductsByLocation(
  buyerLoc: KenyaLocation,
  products: Product[]
): AIProductMatch[] {
  const buyerCounty = (buyerLoc.county || "").trim().toLowerCase();
  const buyerTown = (buyerLoc.town || "").trim().toLowerCase();
  const buyerEstate = (buyerLoc.estate || "").trim().toLowerCase();

  const ranked = products.map((prod) => {
    const pCounty = (prod.location.county || "").trim().toLowerCase();
    const pTown = (prod.location.town || "").trim().toLowerCase();
    const pEstate = (prod.location.estate || "").trim().toLowerCase();

    let proximityScore = 30;
    let distanceLabel = `${prod.location.town}, ${prod.location.county}`;
    let aiBadge = "📍 In Kenya";
    let aiSummary = `Located in ${prod.location.county}`;

    if (pCounty === buyerCounty) {
      proximityScore = 65;
      distanceLabel = `In ${prod.location.town}`;
      aiBadge = `📍 ${prod.location.town}`;
      aiSummary = `Same county (${prod.location.county})`;

      if (pTown === buyerTown) {
        proximityScore = 85;
        distanceLabel = `${prod.location.estate} (~1.5 km)`;
        aiBadge = `📍 ${prod.location.town} Town`;
        aiSummary = `Local in ${prod.location.town}`;

        if (pEstate === buyerEstate) {
          proximityScore = 98;
          distanceLabel = `In ${prod.location.estate} (< 0.5 km)`;
          aiBadge = `🤖 AI Match: In ${prod.location.estate}`;
          aiSummary = `Optimal Match: Right in your neighborhood (${prod.location.estate})`;
        }
      }
    }

    // Promoted boost bonus
    const promotionBoost = prod.isPromoted ? 15 : 0;
    const finalScore = Math.min(100, proximityScore + promotionBoost);

    return {
      product: prod,
      aiMatchScore: finalScore,
      distanceLabel,
      aiBadge,
      aiSummary,
    };
  });

  return ranked.sort((a, b) => {
    // 1. Promoted items with high relevance first
    if (a.product.isPromoted && !b.product.isPromoted) return -1;
    if (!a.product.isPromoted && b.product.isPromoted) return 1;
    // 2. Proximity score
    return b.aiMatchScore - a.aiMatchScore;
  });
}
