---
title: Coding Style
---

# Coding Style

## Rule Priority

OpenMAVCam C/C++ code uses the **Google C++ style** as its baseline. OpenMAVCam-maintained modules use clang-format 15 and the project formatting configuration. Do not copy formatting from third-party dependencies or hand-format code against the active configuration.

```text
OpenMAVCam .clang-format  >  clang-format 15  >  Google C++ style  >  personal preference
```

## Active Configuration

`mav-cam/.clang-format` is generated from `clang-format -style=google -dump-config` and is the reference configuration for OpenMAVCam-maintained C/C++ modules. Its effective rules include 4-space indentation, a 100-column limit, no tabs, right pointer alignment, and case-sensitive regrouped includes.

MAVSDK is a third-party dependency. Do not use its `.clang-format`, `tools/fix_style.sh`, or formatter version to define OpenMAVCam code style. Format OpenMAVCam code with clang-format 15 before committing.

## C/C++ Conventions

| Area | Rule |
| --- | --- |
| Indentation | Four spaces. Never use tabs for indentation. |
| Line length | Keep code within 100 columns; let clang-format determine line wrapping. |
| Braces and whitespace | Use the local `.clang-format`; do not manually change wrapping only to match a personal style. |
| Names | Use descriptive names. Preserve the naming convention already used by the local public API and avoid unrelated renames. |
| Headers | Prefer narrow interfaces. Keep implementation-only dependencies out of public headers where possible. |
| Includes | Let clang-format 15 apply the project include policy: case-sensitive regrouped includes. |
| Comments | Explain a non-obvious constraint, ownership rule, protocol decision, or hardware behavior. Do not restate code. |
| Errors | Check `Result`, boolean, callback result, and timeout paths. Log enough context to identify the failed component and operation. |
| Ownership and lifetime | Make callback/frame ownership explicit. Do not retain camera-frame memory beyond the producing callback unless it has been copied or ownership was transferred. |

## Module Boundaries

Keep changes in the narrowest module that owns the behavior:

- `qcom-cam` and `ir-cam`: sensor and capture behavior;
- `render-bridge`: composition, OSD, and output backends;
- `storage-manager`: storage state and media paths;
- `mav-cam`: MAVLink camera control, settings, FTP, and tracking bridge;
- `object-detection` and `object-tracking`: inference and target association;
- `gimbal-server`: gimbal control behavior.

Do not bypass a public interface merely to avoid adding the appropriate abstraction. Keep test/demo code in its module’s `test/` or `example/` directory instead of coupling it into production services.

## Formatting Commands

Run the OpenMAVCam formatting script from the `mav-cam` repository root. It operates on Git-tracked `.h`, `.c`, `.cpp`, and `.proto` files, compares formatted output, and returns non-zero if formatting changes are required.

```bash
cd src/vendor/aeroratech/mav-cam
tools/fix_style.sh .
```

`mav-cam/tools/fix_style.sh` requires clang-format 15. If the local host does not have that exact version, use the module’s documented Docker invocation rather than accepting output from a different formatter version:

```bash
tools/run-docker.sh tools/fix_style.sh .
```

For OpenMAVCam modules without a module-local style script, run clang-format 15 with the project configuration from the module repository root. Do not run third-party MAVSDK formatting tools on OpenMAVCam code.

## Change and Review Checklist

1. Identify the owning OpenMAVCam module and inspect its `.clang-format` before editing C/C++.
2. Keep the change focused; do not mix behavior changes, broad renames, and mechanical reformatting.
3. Add or update the nearest relevant unit test, module test, or demo validation.
4. Run `mav-cam/tools/fix_style.sh .` or clang-format 15 with the project configuration.
5. Build and run the relevant test/demo, including failure paths where hardware or services can be absent.
6. Review the diff for accidental generated files, third-party changes, whitespace-only churn, credentials, and unrelated files.
7. State the formatter version and verification command in the change description when reviewers need to reproduce the result.

## References

- `src/vendor/aeroratech/mav-cam/.clang-format`
- `src/vendor/aeroratech/mav-cam/tools/fix_style.sh`
