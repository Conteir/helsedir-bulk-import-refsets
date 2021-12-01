//SNOMED CT CONFIGURATIONS

// export const terminlogyServer = "https://snowstorm.conteir.no";
// export const terminlogyServer = "https://seabreeze.conteir.no";

// KEEP ONLY ONE WAY:
export const branches = [
  {
    title: "TEST HELSEDIREKTORATET",
    branch: "MAIN/SNOMEDCT-NO/TEST",
    id: "TEST",
  },
  {
    title: "!PRODUCTION HELSEDIREKTORATET",
    branch: "MAIN/SNOMEDCT-NO/HELSEDIREKTORATET",
    id: "PROD",
  },
];
export const proxy = "https://belarussian.netlify.app/.netlify/functions/proxy";

export const environments = [
  {
    title: "snowstorm (production)",
    urlPart: proxy,
  },
  {
    title: "seabreeze (TEST)",
    urlPart: "https://seabreeze.conteir.no",
  },
];

// Production refsets
export const refsetsProd = [
  {
    id: "Legemiddel",
    title: "Legemiddel - 12881000202101",
    referenceSet: 12881000202101,
  },
  {
    id: "Administrasjonsvei",
    title: "Administrasjonsvei - 23961000202102",
    referenceSet: 23961000202102,
  },
  {
    id: "Styrkeenhet dosering",
    title: "Styrkeenhet dosering - 23911000202104",
    referenceSet: 23911000202104,
  },
  {
    id: "Virkestoff",
    title: "Virkestoff - 23921000202107",
    referenceSet: 23921000202107,
  },
  {
    id: "Tilstand",
    title: "Tilstand - 12711000202103",
    referenceSet: 12711000202103,
  },
];

// refsets for testing
export const refsetsTest = [
  {
    title:
      "Fastleger (test! To delete later and uncomment the old ones!) - 123456789",
    referenceSet: 123456789,
  },
  {
    title: "Just one more test refset",
    referenceSet: 987654321,
  },
  {
    title: "Test refset",
    referenceSet: 1000000000,
  },
  {
    title: "New empty refset",
    referenceSet: 1029384756,
  },
];

// refactored!
export const acceptabilityStatus = [
  {
    id: "ACCEPTABLE",
    title: "ACCEPTABLE",
    refset: 900000000000549004,
  },
  {
    id: "PREFERRED",
    title: "PREFERRED",
    refset: 900000000000548007,
  },
];

export const typeSynonimRefsets = [
  {
    title: "Norwegian bokmål - 61000202103",
    referenceSet: 61000202103,
  },
  {
    title: "Fastleger - 123456789",
    referenceSet: 123456789,
  },
];
