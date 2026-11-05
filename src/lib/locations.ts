export interface TownData {
  town: string;
  estates: string[];
}

export interface CountyData {
  county: string;
  towns: TownData[];
}

export const KENYA_COUNTIES_DATA: CountyData[] = [
  {
    county: "Kisii",
    towns: [
      {
        town: "Kisii Town",
        estates: ["Mwembe", "Milimani", "Daraja Mbili", "Nyanchwa", "Jogoo", "Gesonso", "Maili Mbili", "Suneka Junction", "Total Area", "Botori", "Getare"],
      },
      {
        town: "Ogembo",
        estates: ["Ogembo CBD", "Kenyenya Junction", "Tendere", "Egetuki", "Magena"],
      },
      {
        town: "Suneka",
        estates: ["Suneka Market", "Riana", "Airstrip Area", "Bonyunyu"],
      },
      {
        town: "Keroka",
        estates: ["Keroka Town Centre", "Rigoma Stage", "Ichuni", "Gucha Valley"],
      },
      {
        town: "Nyamache",
        estates: ["Nyamache Market", "Gionseri", "Tugumo", "Emenwa"],
      },
      {
        town: "Marani",
        estates: ["Marani Centre", "Kegogi", "Sombogo"],
      },
    ],
  },
  {
    county: "Nairobi",
    towns: [
      {
        town: "Westlands",
        estates: ["Parklands", "Spring Valley", "Riverside", "Highridge", "Sarit Centre Area", "Mpaka Road"],
      },
      {
        town: "Kilimani",
        estates: ["Yaya Centre", "Argwings Kodhek", "Woodley", "Dennis Pritt", "Hurlingham"],
      },
      {
        town: "Nairobi CBD",
        estates: ["City Centre", "Moi Avenue", "Kenyatta Avenue", "River Road", "Biashara Street"],
      },
      {
        town: "Karen",
        estates: ["Hardy", "Karen Triangle", "Mbagathi", "Windy Ridge", "Bogani"],
      },
      {
        town: "Kasarani",
        estates: ["Roysambu", "Clay City", "Mirema", "Seasons", "Hunters", "Zimmerman"],
      },
      {
        town: "Lang'ata",
        estates: ["Nairobi West", "Madaraka", "South C", "Dam Estate", "Phenom Park"],
      },
      {
        town: "Embakasi",
        estates: ["Nyayo Estate", "Tassia", "Pipeline", "Fedha", "Donholm", "Umoja"],
      },
    ],
  },
  {
    county: "Mombasa",
    towns: [
      {
        town: "Mombasa Island",
        estates: ["Ganjoni", "Old Town", "Kizingo", "Tudor", "Makadara"],
      },
      {
        town: "Nyali",
        estates: ["Links Road", "Cinemax Area", "Beach Road", "Kongowea", "Bamburi"],
      },
      {
        town: "Likoni",
        estates: ["Ferry Area", "Shelly Beach", "Consolata"],
      },
      {
        town: "Changamwe",
        estates: ["Port Reitz", "Chaani", "Airport Area", "Magongo"],
      },
    ],
  },
  {
    county: "Kisumu",
    towns: [
      {
        town: "Kisumu City",
        estates: ["Milimani", "Kondele", "Riat Hills", "Mamboleo", "Tom Mboya", "Migosi", "Nyalenda", "Manyatta"],
      },
      {
        town: "Maseno",
        estates: ["Maseno University Area", "Siriba", "Chulaimbo"],
      },
      {
        town: "Ahero",
        estates: ["Ahero Junction", "Irrigation Scheme Area", "Boyo"],
      },
    ],
  },
  {
    county: "Nakuru",
    towns: [
      {
        town: "Nakuru City",
        estates: ["Milimani", "Section 58", "Naka", "Kiamunyi", "Free Area", "Pipeline", "London", "Lanet"],
      },
      {
        town: "Naivasha",
        estates: ["Moi South Lake", "Karagita", "Town Centre", "Site and Service"],
      },
      {
        town: "Molo",
        estates: ["Molo Town", "Elburgon", "Turi"],
      },
    ],
  },
  {
    county: "Kiambu",
    towns: [
      {
        town: "Thika",
        estates: ["Section 9", "Makongeni", "Landless", "Ngoingwa", "Chania"],
      },
      {
        town: "Ruiru",
        estates: ["Membley", "Kimbo", "Kenyatta Road", "Mwiki Ruiru", "Tatu City"],
      },
      {
        town: "Kikuyu",
        estates: ["Kikuyu Town", "Ondiri", "Thogoto", "Sigona", "Zambezi"],
      },
      {
        town: "Kiambu Town",
        estates: ["Ndumberi", "Riabai", "Kirigiti", "Edenville"],
      },
    ],
  },
  {
    county: "Uasin Gishu",
    towns: [
      {
        town: "Eldoret",
        estates: ["Elgon View", "Kapsoya", "Pioneer", "Langas", "West Indies", "Maili Nne", "Action"],
      },
    ],
  },
  {
    county: "Machakos",
    towns: [
      {
        town: "Machakos Town",
        estates: ["Katheka Kai", "Miwani", "Eastleigh", "Machakos CBD", "Kiamba"],
      },
      {
        town: "Syokimau / Mlolongo",
        estates: ["Syokimau Gateway", "Mlolongo Phase 1", "Katani", "Signature Mall Area"],
      },
    ],
  },
  {
    county: "Nyeri",
    towns: [
      {
        town: "Nyeri Town",
        estates: ["King'ong'o", "Ring Road", "Kamakwa", "Skuta", "Nyamachaki"],
      },
      {
        town: "Karatina",
        estates: ["Karatina Market Area", "Ragati", "Muthua"],
      },
    ],
  },
  {
    county: "Meru",
    towns: [
      {
        town: "Meru Town",
        estates: ["Makutano", "Milimani", "Kinoru", "Gakoromone", "Kaaga"],
      },
    ],
  },
  {
    county: "Kakamega",
    towns: [
      {
        town: "Kakamega Town",
        estates: ["Milimani", "Amalemba", "Lurambi", "Kefinco", "Shikambi"],
      },
    ],
  },
  {
    county: "Kilifi",
    towns: [
      {
        town: "Malindi",
        estates: ["Casuarina", "Town Centre", "Shella", "Mtangani"],
      },
      {
        town: "Kilifi Town",
        estates: ["Mnarani", "Bofa Beach Area", "Pwani University Zone"],
      },
    ],
  },
];

export function getCountiesList(): string[] {
  return KENYA_COUNTIES_DATA.map((c) => c.county);
}

export function getTownsByCounty(countyName: string): string[] {
  const found = KENYA_COUNTIES_DATA.find((c) => c.county.toLowerCase() === countyName.toLowerCase());
  return found ? found.towns.map((t) => t.town) : [];
}

export function getEstatesByTown(countyName: string, townName: string): string[] {
  const county = KENYA_COUNTIES_DATA.find((c) => c.county.toLowerCase() === countyName.toLowerCase());
  if (!county) return [];
  const town = county.towns.find((t) => t.town.toLowerCase() === townName.toLowerCase());
  return town ? town.estates : [];
}
