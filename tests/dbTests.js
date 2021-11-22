// ----- Normal NeDB

// const Datastore = require('nedb');
// const db = new Datastore({ filename: './tests/dbTests/botMemory_test.db', autoload: true });

// const getClientCurrentStep = (clientId) => new Promise((resolve) => {
//   db.findOne({ _id: clientId }, (error, currentClient) => {
//     if (currentClient) {
//       console.log({ currentClient });
//       resolve(currentClient.currentStep);
//       return;
//     }
//     db.insert({ _id: clientId, currentStep: 1 }, (_e, _d) => {
//       console.log('Insert new!');
//       resolve(1);
//     });
//   });
// });

// const updateClientStep = (clientId) => new Promise((resolve) => {
//   db.update(
//     { _id: clientId },
//     { $inc: { currentStep: 1 } },
//     {},
//     () => resolve(true),
//   );
// });

// const resetClientStep = (clientId) => new Promise((resolve) => {
//   db.findOne({ _id: clientId }, (error, currentClient) => {
//     if (currentClient) {
//       resolve(currentClient.currentStep);
//       return;
//     }
//     db.insert({ _id: clientId, currentStep: 1 }, (_e, _d) => {
//       resolve(1);
//     });
//   });
// });

// async function testera() {
//   const currentStep = await getClientCurrentStep(2);
//   return currentStep;
// }
// async function teste() {
//   const currentStep = await testera();
//   console.log({ currentStep });

//   // const beforeUpdate = await getClientCurrentStep(2);
//   // console.log({ beforeUpdate });

//   const newStep = await updateClientStep(2);
//   console.log({ newStep });

//   // const afterUpdate = await getClientCurrentStep(2);
//   // console.log({ afterUpdate });
// }

// ----- Promise NeDB
// const sessionRepository = require('../src/services/sessionDb/Repository');

// async function teste() {
//   const userStep = await sessionRepository.GetClientCurrentStep(1);
//   console.log({ userStep });
//   // const inserted = await db.insert({ _id: 1, currentStep: 1 });
//   // const { currentStep } = await db.findOne({ _id: 1 });
//   // console.log({ currentStep });
//   // const updated = await db.update({ _id: 1 }, { $set: { currentStep: currentStep + 1 } });
//   // const find = await db.find({ _id: 1 });
//   // console.log({ find });
//   // return true;
// }
// teste();
