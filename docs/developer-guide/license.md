---
title: License
---

# License

## OpenMAVCam Code

OpenMAVCam-authored code is licensed under the **Apache License, Version 2.0** (Apache-2.0). Unless a file contains a different license notice, contributors must add new OpenMAVCam code under Apache-2.0 and preserve existing copyright and license headers.

Apache-2.0 applies to OpenMAVCam code only. It does not replace, relicense, or remove the obligations of third-party, vendor, binary, model, firmware, or SDK dependencies included in a source tree or product image.

## Third-Party License List

The following entries are confirmed from license files or build metadata in the D64TR source workspace. This is a component index, not a substitute for the complete notices shipped with a particular product image.

| Component | License / terms | Evidence in the D64TR workspace |
| --- | --- | --- |
| MAVSDK | BSD 3-Clause | `src/vendor/aeroratech/MAVSDK/LICENSE.md` |
| Adobe XMP Toolkit SDK | BSD 3-Clause | `src/vendor/aeroratech/XMP-Toolkit-SDK/LICENSE` |
| ONNX Runtime for DeepSORT | MIT | `src/vendor/aeroratech/object-tracking/deepsort/3rdParty/onnxruntime-linux-aarch64-1.12.1/LICENSE` |
| Qualcomm proprietary camera, BSP, graphics, and related packages | Qualcomm Technologies proprietary terms | `poky/meta-qti-camera-prop/` and related `meta-qti-*-prop` recipe metadata declare `Qualcomm-Technologies-Inc.-Proprietary` or `QTI-Proprietary`. |

The D64TR build also brings in dependencies through Yocto recipes and component-specific third-party trees. Their applicable license text, notices, source-offer requirements, and redistribution terms remain with the version actually built into the image.

## Distribution Rules

1. Preserve Apache-2.0 notices for OpenMAVCam-authored code.
2. Preserve every third-party copyright notice, license text, NOTICE file, attribution, and source-disclosure obligation required by shipped components.
3. Do not distribute Qualcomm proprietary packages, SNPE, firmware, binary blobs, SDK installers, model assets, or other restricted material unless the applicable vendor agreement explicitly permits it.
4. When adding or upgrading a dependency, record its exact version, license, notice location, build inclusion path, and redistribution requirements before release.
5. Generate and review the product-image license/notice inventory as part of release approval; a source checkout alone may not represent every binary delivered in an image.

## Contributor Rules

- Only submit code and assets you have the right to contribute under Apache-2.0.
- Do not copy third-party code into an OpenMAVCam module without preserving its license and obtaining review of compatibility and distribution obligations.
- Keep vendor-proprietary code and credentials out of public repositories and pull requests.
- If a file already has a different license notice, retain it and ask maintainers before changing or moving it.

## Notice About Legal Review

This page describes the project’s engineering policy and the license evidence available in the D64TR workspace. It is not legal advice. Organizations distributing a product must review the exact bill of materials, component licenses, notices, and commercial agreements for the released image.
