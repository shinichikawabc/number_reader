import * as tf from '@tensorflow/tfjs';
const model = await tf.loadGraphModel('/model/model.json')

export default model;