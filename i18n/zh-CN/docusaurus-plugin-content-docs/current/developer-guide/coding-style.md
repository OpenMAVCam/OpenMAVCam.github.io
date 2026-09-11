---
title: 编码风格
---

# 编码风格

## 规则优先级

OpenMAVCam C/C++ 代码以 **Google C++ style** 为基线。OpenMAVCam 维护的模块统一使用 clang-format 15 和项目格式化配置。不要从 third-party dependency 复制格式，也不要以手工格式覆盖当前配置。

```text
OpenMAVCam .clang-format  >  clang-format 15  >  Google C++ style  >  personal preference
```

## 活跃配置

`mav-cam/.clang-format` 由 `clang-format -style=google -dump-config` 生成，是 OpenMAVCam 维护模块的参考配置。其生效规则包括 4-space indentation、100-column limit、no tabs、right pointer alignment 和 case-sensitive regrouped include。

MAVSDK 是 third-party dependency。不可使用其 `.clang-format`、`tools/fix_style.sh` 或 formatter version 定义 OpenMAVCam code style。提交前使用 clang-format 15 格式化 OpenMAVCam 代码。

## C/C++ 约定

| 范围 | 规则 |
| --- | --- |
| Indentation | 使用四个空格。不可使用 tab 进行 indentation。 |
| Line length | 代码保持在 100 columns 内；由 clang-format 决定 line wrapping。 |
| Brace 和 whitespace | 使用本地 `.clang-format`；不可只为个人风格手工改变 wrapping。 |
| Name | 使用描述性 name。保持本地 public API 已采用的 naming convention，避免无关 rename。 |
| Header | 优先使用窄接口。尽可能不要把 implementation-only dependency 放进 public header。 |
| Include | 由 clang-format 15 使用项目 include policy：case-sensitive regrouped include。 |
| Comment | 解释不明显的 constraint、ownership rule、protocol decision 或 hardware behavior；不要重复代码本身。 |
| Error | 检查 `Result`、boolean、callback result 和 timeout path。log 应包含 failed component 和 operation。 |
| Ownership 和 lifetime | 明确 callback/frame ownership。除非已复制或转移 ownership，不可在 producing callback 之外保留 camera-frame memory。 |

## 模块边界

将修改放在拥有行为的最窄模块中：

- `qcom-cam` 和 `ir-cam`：sensor 和 capture behavior；
- `render-bridge`：composition、OSD 和 output backend；
- `storage-manager`：storage state 和 media path；
- `mav-cam`：MAVLink camera control、setting、FTP 和 tracking bridge；
- `object-detection` 和 `object-tracking`：inference 和 target association；
- `gimbal-server`：gimbal control behavior。

不可为了避免添加正确 abstraction 而绕过 public interface。test/demo code 放在模块的 `test/` 或 `example/` 目录，不要耦合到 production service。

## 格式化命令

从 `mav-cam` repository root 运行 OpenMAVCam 格式化脚本。它操作 Git-tracked `.h`、`.c`、`.cpp` 和 `.proto` 文件，比较格式化结果，并在需要修改时返回 non-zero。

```bash
cd src/vendor/aeroratech/mav-cam
tools/fix_style.sh .
```

`mav-cam/tools/fix_style.sh` 要求 clang-format 15。本地主机没有该精确版本时，使用模块中有文档的 Docker invocation，不接受其他 formatter version 的输出：

```bash
tools/run-docker.sh tools/fix_style.sh .
```

对于没有 module-local style script 的 OpenMAVCam module，从模块 repository root 使用项目配置运行 clang-format 15。不可对 OpenMAVCam 代码运行 third-party MAVSDK formatting tool。

## 修改和 Review Checklist

1. 修改 C/C++ 前，识别 owning OpenMAVCam module 并查看其 `.clang-format`。
2. 保持修改聚焦；不要混合 behavior change、broad rename 和 mechanical reformatting。
3. 增加或更新最近相关的 unit test、module test 或 demo validation。
4. 运行 `mav-cam/tools/fix_style.sh .` 或使用项目配置运行 clang-format 15。
5. build 并运行相关 test/demo；hardware 或 service 可能缺失时也验证 failure path。
6. review diff，检查 accidental generated file、third-party change、whitespace-only churn、credential 和无关文件。
7. 当 reviewer 需要复现时，在 change description 中说明 formatter version 和 verification command。

## 参考

- `src/vendor/aeroratech/mav-cam/.clang-format`
- `src/vendor/aeroratech/mav-cam/tools/fix_style.sh`
