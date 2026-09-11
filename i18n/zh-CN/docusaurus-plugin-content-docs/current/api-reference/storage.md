---
title: Storage
---

# Storage

## 范围

使用 `StorageManager` 发现存储设备、接收容量状态、创建媒体路径，并仅在产品策略允许时格式化存储。本文遵循 `storage-manager/test/storage_manager_test.cc`。

## Factory 和生命周期

库在运行时加载。解析 `create_storage_manager`，为实际媒体类型创建一个 manager，调用 `open()`，订阅状态，最后在删除实例前调用 `close()`。

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

## API 规则

| API | 调用规则 | 预期结果 |
| --- | --- | --- |
| `create_storage_manager(StorageType)` | 根据实际产品集成选择 `UsbStick`、`SD`、`Internal` 或 `Unknown`。 | 非空 manager instance。 |
| `open(std::string& store_prefix)` | 在 media-path、index 或 format 调用前仅调用一次。 | 仅 storage backend 就绪时返回 `true`。 |
| `subscribe_storage_info(callback)` | `open()` 成功后注册。每次 callback 均视为当前数据源。 | `StorageInformation` 包含状态、容量、ID、类型和 read/write speed。 |
| `get_storage_path()` | 仅在 `open()` 成功后使用。 | 非空可写 media root。 |
| `get_file_index()` | 与 path/prefix 组合生成应用文件名。 | 当前 integer file index。 |
| `format_storage()` | 仅经明确且产品允许的 format action 调用。 | 格式化成功时返回 `true`。 |
| `close()` | 删除 instance 或卸载 library 前调用。 | 释放 storage resource。 |

## Callback 验证

在 callback 中检查：

- `storage_status`：`NotAvailable`、`Unformatted`、`Formatted` 或 `NotSupported`；
- `used_storage_mib`、`available_storage_mib` 和 `total_storage_mib`；
- `storage_id` 和 `storage_type`；
- backend 提供时检查 `read_speed_mib_s` 和 `write_speed_mib_s`。

仅当 callback 报告可用且已格式化的 storage，并且 `get_storage_path()` 非空时，才拍照或开始录像。

## Demo 步骤

`storage_manager_test` 进行以下最小检查：

1. 加载 `libstorage_manager.so` 并解析 `create_storage_manager`。
2. 创建 `StorageType::SD`，调用 `open("")`，再注册 `subscribe_storage_info()`。
3. 确认打印的 status、free MiB 和 total MiB 与 target device 一致。
4. 按 Enter 退出；Demo 调用 `close()`、删除 manager 并调用 `dlclose()`。

## 源码参考

- `storage-manager/storage/storage_manager.h`
- `storage-manager/test/storage_manager_test.cc`
