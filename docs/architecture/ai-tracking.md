---
title: AI
---

# AI

## Purpose

Run vision models at the D64TR payload edge, then provide detection and tracking results to the renderer and MAVLink camera services. The implementation keeps the AI service separate from `mav-cam`, so model/inference changes do not alter the MAVLink camera control path.

## Inputs / Prerequisites

| Item | Required value |
| --- | --- |
| Target | D64TR / QRB5165 |
| SDK version | SNPE 2.20.0 |
| SDK access | Qualcomm ID, QPM access, accepted license |
| Model source | Trained ONNX model with known input/output tensors, labels, and preprocessing |
| Runtime assets | DLC, labels, model configuration, matching target libraries |

## Runtime Flow

```text
ONNX model → SNPE converter → DLC → target inference service
           → detection / tracking frame → renderer + MAVLink camera path
```

### Install SNPE

Use SNPE 2.20.0 for D64TR. Do not substitute a newer release solely because it is currently shown by QPM; conversion and target runtime must match the product image.

```bash
qpm-cli --login <qualcomm-id>
qpm-cli --license-activate qualcomm_neural_processing_sdk
qpm-cli --extract /path/to/snpe-2.20.0-installer.qik
export SNPE_ROOT=/opt/qcom/aistack/snpe/<installed-2.20.0-directory>
source "$SNPE_ROOT/bin/envsetup.sh"
snpe-onnx-to-dlc --help
snpe-dlc-info --help
```

Select the SNPE 2.20.0 Linux package available to the Qualcomm account. OpenMAVCam does not redistribute QPM, SNPE, Qualcomm runtimes, or licenses.

### Model Porting using SNPE

```bash
snpe-onnx-to-dlc --input_network model.onnx --output_path model.dlc
snpe-dlc-info --input_dlc model.dlc
snpe-dlc-quantize --input_dlc model.dlc --input_list calibration.txt --output_dlc model-quantized.dlc
snpe-net-run --container model.dlc --input_list input_list.txt
```

| Step | Required check |
| --- | --- |
| Export | Record ONNX tensor names, shapes, layout, color order, normalization, labels, and output decoding. |
| Convert | Supply actual input dimensions, output nodes, and model-specific converter flags. |
| Inspect | Confirm the DLC tensors using `snpe-dlc-info`. |
| Quantize | Use representative calibration data only when the product integration requires it. |
| Deploy | Copy DLC, labels, and configuration together; validate on the D64TR target. |

## Source Code Entry Points

| Responsibility | Component |
| --- | --- |
| MAVLink camera control | `mav-cam` |
| Detection integration demo | [object-detection](https://github.com/OpenMAVCam/object-detection) |
| Tracking integration demo | [object-tracking](https://github.com/OpenMAVCam/object-tracking) |
| Tracking control / overlays | Local tracking service, `TrackingFrame`, renderer |

## Outputs

| Output | Consumer |
| --- | --- |
| Class ID, confidence, bounding box | Renderer and detection client |
| Selected target / tracking updates | Local tracking service and live preview |
| Tracking control status | MAVLink tracking response path |

## State and Data Fields

- Enabling the AI function starts the required detection/tracking service.
- Disabling AI stops the services, clears cached tracking data, and removes rendered boxes.
- Model input/output contract is product data: changing it requires matching changes to preprocessing and postprocessing.

## Failure Conditions

- A successful ONNX-to-DLC conversion does not prove target accuracy, latency, or accelerator compatibility.
- Mismatched SNPE versions, runtime libraries, tensor layout, labels, or output decoding invalidate the integration.
- An accepted tracking command does not guarantee that the model has acquired a target.

## Validation

1. Run `snpe-dlc-info` and a target-side `snpe-net-run` smoke test.
2. Run [object-detection](https://github.com/OpenMAVCam/object-detection); verify class IDs, confidence, boxes, and latency.
3. Run [object-tracking](https://github.com/OpenMAVCam/object-tracking); verify acquisition, updates, loss, and tracking-off behavior.
4. Validate the custom model against mission data before release.

## References

- [SNPE installation guide](https://docs.qualcomm.com/bundle/publicresource/topics/80-70015-15B/snpe-download.html)
- [Model Porting using SNPE](https://docs.qualcomm.com/bundle/publicresource/topics/80-70014-15B/snpe-port-model.html)
- [Tracking](../protocol/tracking.md)
