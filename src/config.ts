//SNOMED CT CONFIGURATIONS

export const terminlogyServer = "https://snowstorm.conteir.no";
// export const terminlogyServer =
//   "https://snowstorm-demo.northeurope.cloudapp.azure.com";

export const refsets = [
  {
    id: "ICPC-2",
    title: "ICPC-2 - 17551000202109",
    referenceSet: 17551000202109,
  },
  {
    id: "NCxP",
    title: "NCxP - 123456789",
    referenceSet: 123456789,
  },
  {
    branch: "MAIN/ICPC-2",
    title: "ICPC-2B",
    referenceSet: 450993002,
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
  // {
  //   id: "PREFERRED",
  //   // title: "NCxP - 123456789",
  //   referenceSet: 900000000000509007,
  // },
  // {
  //   id: "PREFERRED",
  //   // title: "NCxP - 123456789",
  //   referenceSet: 900000000000508004,
  // },
  // {
  //   id: "ACCEPTABLE",
  //   // title: "NCxP - 123456789",
  //   referenceSet: 900000000000509007,
  // },
  // {
  //   id: "ACCEPTABLE",
  //   // title: "NCxP - 123456789",
  //   referenceSet: 900000000000508004,
  // }
];

export const typeStatus = [
  {
    id: "ACCEPTABLE",
    title: "ACCEPTABLE",
  },
  {
    id: "PREFERRED",
    title: "PREFERRED",
  },
];

/*export const params = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Ocp-Apim-Subscription-Key": "89b72a3ad5cf4723b3f489c3eb4d82a1",
    },
  };*/
