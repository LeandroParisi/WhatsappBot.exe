export default interface ISessionDb<ModelType> {
  insert : (object) => void;
  findOne : (object) => ModelType;
}