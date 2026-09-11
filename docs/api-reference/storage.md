---
title: Storage
---

# Storage

## Scope

Use `StorageManager` to discover a storage device, receive its capacity state, create media paths, and format it when the product policy allows. This page follows `storage-manager/test/storage_manager_test.cc`.

## Factory and Lifecycle

The library is loaded at runtime. Resolve `create_storage_manager`, create one manager for the actual media type, call `open()`, then subscribe and finally call `close()` before deleting the instance.

```cpp
void* handle = dlopen("libstorage_manager.so", RTLD_NOW);
auto create = reinterpret_cast<StorageManager* (*)(StorageType)>(
    dlsym(handle, "create_storage_manager"));
StorageManager* storage = create(StorageType::SD);

std::string prefix = "AERORA";
if (!storage->open(prefix)) {
    // Do not start capture or recording.
}

storage->subscribe_storage_info([](StorageInformation info) {
    // Consume current storage status and capacity.
});

storage->close();
delete storage;
dlclose(handle);
```

## API Rules

| API | Call rule | Expected result |
| --- | --- | --- |
| `create_storage_manager(StorageType)` | Choose `UsbStick`, `SD`, `Internal`, or `Unknown` from the actual product integration. | Non-null manager instance. |
| `open(std::string& store_prefix)` | Call once before media-path, index, or format calls. | `true` only when the storage backend is ready. |
| `subscribe_storage_info(callback)` | Register after successful `open()`. Treat every callback as the current source of truth. | `StorageInformation` includes state, capacity, ID, type, and read/write speed. |
| `get_storage_path()` | Use only after `open()` succeeds. | Non-empty writable media root. |
| `get_file_index()` | Combine with the path/prefix to construct an application filename. | Current integer file index. |
| `format_storage()` | Expose only through an explicit, product-approved format action. | `true` when formatting succeeds. |
| `close()` | Call before deleting the instance or unloading the library. | Releases storage resources. |

## Callback Validation

Check these `StorageInformation` fields in the callback:

- `storage_status`: `NotAvailable`, `Unformatted`, `Formatted`, or `NotSupported`;
- `used_storage_mib`, `available_storage_mib`, and `total_storage_mib`;
- `storage_id` and `storage_type`; and
- `read_speed_mib_s` and `write_speed_mib_s` when the backend provides them.

Do not capture photos or start recording unless the callback reports usable formatted storage and a non-empty `get_storage_path()`.

## Demo Procedure

`storage_manager_test` performs this minimal check:

1. Load `libstorage_manager.so` and resolve `create_storage_manager`.
2. Create `StorageType::SD`, call `open("")`, then register `subscribe_storage_info()`.
3. Confirm the printed status, free MiB, and total MiB match the target device.
4. Press Enter to exit; the demo calls `close()`, deletes the manager, and calls `dlclose()`.

## Source References

- `storage-manager/storage/storage_manager.h`
- `storage-manager/test/storage_manager_test.cc`
