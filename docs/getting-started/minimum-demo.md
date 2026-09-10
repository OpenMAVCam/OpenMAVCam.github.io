---
title: Minimum Demo
---
Clone and build the tracking demo:

```bash
git clone https://github.com/OpenMAVCam/object-tracking.git
cd object-tracking
cmake -S . -B build
cmake --build build
./build/object_tracking
```

The target requires SNPE support and a camera producer for the preview shared-memory segment.
