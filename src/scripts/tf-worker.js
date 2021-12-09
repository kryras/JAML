import { loadLayersModel, zeros, browser, cast } from '@tensorflow/tfjs'

let model
self.addEventListener('message', async e => {
  try {
    model = await loadLayersModel(`indexeddb://${e.data.modelName}`)
    if (e.data.action === "warmup") {
      const warmupResult = model.predict(zeros([1, 48, 48, 1]))
      warmupResult.dataSync()
      warmupResult.dispose()
      e.ports[0].postMessage({ result: "Warmup completed" });
    } else if (e.data.action === "predict") {
      let tensorImage = browser
        .fromPixels(e.data.picture)
        .resizeNearestNeighbor([48, 48])
        .div(255)
        .toInt()
        .mean(2)
        .expandDims(2)
        .expandDims(0)
        .arraySync()
      tensorImage = cast(tensorImage, 'int32')

      let result = model.predict(tensorImage)
      result = Array.from(result.dataSync())
      let predictedClass = null
      let topPredictions = []
      for (let index = 0; index < e.data.quantity; index++) {
        predictedClass = result.indexOf(Math.max(...result))
        topPredictions.push(predictedClass)
        result.splice(predictedClass, 1)
      }
      e.ports[0].postMessage({ result: topPredictions });
    }
  } catch (e) {
    e.ports[0].postMessage({ error: e });
  }
}, false)