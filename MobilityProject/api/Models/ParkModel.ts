'use strict';
import mongoose from 'mongoose';
let Schema = mongoose.Schema;

/**
 * @typedef ParkSchema
 * @property {string} name
 * @property {number} placesNumber
 * @property {number} floorsNumber
 * @property {string} dateInit
 * @property {string} dateEnd
 * @property {Array.<string>} places  - UUID
 */
let ParkSchema = new Schema({
  name: {
    type: String,
    required: 'Set a name'
  },
  placesNumber: {
    type: Number
  },
  floorsNumber: {
    type: Number
  },
  dateInit: {
    type: Date
  },
  dateEnd: {
    type: Date
  },
  places: [{ type: Schema.Types.ObjectId, ref: 'PlaceModel' }]
});
export default mongoose.model('ParkModel', ParkSchema);
