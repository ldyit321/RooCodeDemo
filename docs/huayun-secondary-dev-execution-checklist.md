# HUAYUN Secondary Dev 验收清单（可执行版）

本文档用于直接测试 `HUAYUN Secondary Dev` 模式是否已经具备：

- OAuth2 前置能力
- CrownCAD API 正确使用能力
- 标准脚手架与架构能力
- Run / Package 按钮闭环能力

你可以把下面每一条“测试提示词”直接复制到 `HUAYUN Secondary Dev` 模式里执行。

---

## 一、执行规则

每次测试时建议保持以下条件一致：

- 当前模式必须是 `HUAYUN Secondary Dev`
- 已填写“二开配置”
- OAuth2 配置已填写：
    - Base URL
    - Client ID
    - Client Secret
- 当前只围绕已知 API 进行测试
- 每次测试后记录：
    - 首轮是否先做 OAuth2
    - 是否使用正确 API
    - 是否按模板输出
    - 是否说明如何 Run / Package

---

## 二、按轮次执行建议

不要一开始把所有场景塞进一个任务里跑。

最推荐的方式是分两轮：

### 第一轮：逐项验收

目标是单点验证每项能力有没有生效，方便定位问题。

建议顺序：

1. OAuth2 前置能力
2. 文档创建功能
3. 文档删除功能
4. CrownScript 执行功能
5. 模板与架构稳定性
6. Run 按钮验证
7. Package 按钮验证

这一轮的特点：

- 每个场景单独开一个任务
- 每次只验证一个核心能力
- 出问题时容易判断是哪条规则没生效

### 第二轮：整体验收

目标是验证整条链路能不能串起来，而不是只看单项是否存在。

建议顺序：

1. 跑“推荐组合测试”
2. 点击 Run 按钮验证运行链路
3. 点击 Package 按钮验证打包链路

这一轮的特点：

- 用一个相对完整的任务串起认证、接口、模板、运行、打包
- 看整体体验是否像你的专属二开工程师
- 不适合拿来排查第一层规则问题

### 一句话判断

- 如果你现在还在调模式规则：先跑第一轮
- 如果第一轮大部分已经通过：再跑第二轮

---

## 三、第一轮：逐项验收场景

这一轮每个场景都建议单独新开一个任务。

---

## 场景 1：OAuth2 前置能力

### 目标

验证模式是否把认证当作所有二开任务的前置阶段。

### 测试提示词

```text
请用 HUAYUN Secondary Dev 模式，先完成 CrownCAD OAuth2 接入设计，再准备后续文档管理功能。
要求：
1. 前端使用 Vue
2. 后端使用 Python
3. 不要直接开始写业务页面
4. 先说明认证流程、token 注入、回调处理和验证方式
```

### 预期结果

- 首轮先进入 OAuth2 阶段
- 使用 `authorizationCode`
- 明确：
    - `/oauth/crownapi/authorize`
    - `/oauth/token`
- 说明：
    - token 获取
    - token 存储
    - token 注入
    - callback 处理
- 不直接进入业务页面开发

### 失败信号

- 不提 OAuth2
- 直接写 `/api/document`
- 默认使用 BasicAuth 或 BearerAuth

---

## 场景 2：文档创建功能

### 目标

验证文档创建接口是否被正确使用，并且模板结构是否合理。

### 测试提示词

```text
请用 HUAYUN Secondary Dev 模式，基于标准脚手架实现一个“创建文档”功能。
要求：
1. 前端使用 Vue
2. 后端使用 Python 代理 CrownCAD API
3. 必须先完成 OAuth2
4. 严格使用我已提供的 API
5. 不允许发明新接口
6. 完成后告诉我应该如何通过 Run 和 Package 按钮验证
```

### 预期结果

- 使用 `POST /api/document`
- 前端至少包含字段：
    - `projectId`
    - `docName`
    - `docType`
    - `folderPath`
- `docType` 只允许：
    - `PartDocument`
    - `AssemblyDocument`
    - `DrawingDocument`
    - `FolderDocument`
- 后端 Python 做参数校验
- 前端和后端结构分层明确

### 失败信号

- 使用不存在的接口
- 自动猜测 `docType`
- 后端不用 Python
- 把 API、认证、页面逻辑混在一起

---

## 场景 3：文档删除功能

### 目标

验证是否能在现有模板基础上增量扩展，而不是重起炉灶。

### 测试提示词

```text
请在上一个“文档创建功能”的基础上，继续补一个“删除文档”能力。
要求：
1. 继续复用现有 OAuth2 结构
2. 继续复用前端模板和 Python 代理层
3. 不要重新发明目录结构
4. 严格使用我提供的 API
5. 完成后说明 Run 和 Package 如何继续验证这个能力
```

### 预期结果

- 使用 `DELETE /api/document`
- 参数使用：
    - `documentName`
- 复用已有 auth / service / request 结构
- 作为增量功能继续扩展

### 失败信号

- 写成 `/api/document/delete`
- 重新起一套新的结构
- 删除逻辑不走既有后端代理

---

## 场景 4：CrownScript 执行功能

### 目标

验证最关键的 multipart 请求场景。

### 测试提示词

```text
请用 HUAYUN Secondary Dev 模式，基于现有模板实现一个 CrownScript 执行功能。
要求：
1. 前端提供 code 输入区
2. 后端用 Python 代理调用 CrownCAD
3. 必须先验证 OAuth2 已接入
4. 请求必须严格符合我提供的 API
5. 不允许把请求写成 JSON
6. 完成后告诉我如何通过 Run 和 Package 按钮验证
```

### 预期结果

- 使用 `POST /api/crownscript`
- query 参数包含：
    - `projectId`
    - `documentId`
    - `docType`
    - `overwrite`
- body 使用 `multipart/form-data`
- form-data 中包含：
    - `code`
- `docType` 仅允许：
    - `PartDocument`
    - `AssemblyDocument`
- 有成功/失败状态处理

### 失败信号

- 写成 JSON 请求
- 缺失 `code`
- 缺失 `overwrite`
- 未验证认证成功就执行

---

## 场景 5：模板与架构稳定性

### 目标

验证它是不是按 HUAYUN 规则生成，而不是临时拼接。

### 测试提示词

```text
请用 HUAYUN Secondary Dev 模式，基于标准脚手架实现一个最小可运行的 CrownCAD 文档管理模块。
要求：
1. 先完成 OAuth2
2. 前端使用 Vue
3. 后端使用 Python
4. 前后端必须按标准分层架构输出
5. 不要把认证、页面逻辑、请求逻辑混在同一个文件
6. 输出时请明确说明你采用的目录结构和每层职责
```

### 预期结果

- OAuth2 独立模块
- 前端组件、服务、页面分开
- Python route / service / client 分开
- 能说明模板结构来源
- 明确各层职责

### 失败信号

- 前端组件里直接堆认证逻辑
- 后端所有逻辑塞一个文件
- 完全不提标准脚手架

---

## 场景 6：Run 按钮验证

### 目标

验证你新增的运行按钮能不能接住生成结果。

### 测试提示词

```text
请用 HUAYUN Secondary Dev 模式，完成一个最小可运行的 CrownCAD 文档创建页面与 Python 代理接口。
完成后请不要只说“可以运行”，而是明确告诉我：
1. Run 按钮应该启动什么
2. 它会优先识别哪些目录
3. 如果运行失败，最可能缺什么
```

### 执行操作

代码生成后，点击任务卡片中的：

- `Run secondary dev workspace`

### 预期结果

- 能启动前端
- 能启动后端
- 能自动尝试打开预览
- 如果缺入口，会明确提示缺前端或后端入口

### 失败信号

- 按钮没反应
- 只开前端不管后端
- 启动失败却没有清晰提示

---

## 场景 7：Package 按钮验证

### 目标

验证打包能力是否可用于后续部署整理。

### 测试提示词

```text
请用 HUAYUN Secondary Dev 模式，完成一个可打包的最小 CrownCAD 二开功能。
要求：
1. 前端和后端都要纳入标准脚手架
2. 完成后告诉我 Package 按钮会如何构建与收集产物
3. 告诉我最终打包结果里应该看到哪些目录和文件
```

### 执行操作

代码生成后，点击任务卡片中的：

- `Package secondary dev workspace`

### 预期结果

- 会先跑前端 build
- 后端如有构建能力会先构建
- 工作区下生成：
    - `.huayun-packages/`
- 打包内容至少包含：
    - `frontend/`
    - `backend/`
    - `manifest.json`

### 失败信号

- 不构建直接打包
- 只收集前端
- 没有清晰产物目录

---

## 四、第二轮：整体验收场景

这一轮建议在第一轮大部分通过之后再跑。

---

## 场景 8：推荐组合测试

如果你想一次性测整条链路，建议直接用这条总测试提示词：

```text
请用 HUAYUN Secondary Dev 模式，基于标准脚手架实现一个 CrownCAD 文档管理最小功能集，包含：
1. OAuth2 前置接入
2. 文档创建
3. 文档删除
4. 前端使用 Vue
5. 后端使用 Python
6. 严格使用我已提供的 API
7. 完成后明确说明如何使用 Run 和 Package 按钮验证
8. 不允许发明未提供的新接口
```

### 这条总测试应覆盖

- OAuth2 是否前置
- `/api/document` create / delete 是否正确
- Vue + Python 模板是否稳定
- Run / Package 是否能接住产物

---

## 五、推荐执行顺序

### 第一轮建议这样跑

1. 先跑场景 1
2. 场景 1 通过后，再跑场景 2
3. 场景 2 通过后，再跑场景 3
4. 场景 3 和 4 用来验证 API 使用稳定性
5. 场景 5 用来检查它是不是“写得像你定义的模板”
6. 最后再点 Run 和 Package

### 第二轮建议这样跑

1. 直接跑场景 8
2. 看它是否能从 OAuth2 一直走到业务功能
3. 再手动点击 Run
4. 再手动点击 Package

---

## 六、快速判定标准

如果它满足以下条件，就基本可以判定模式可用：

- 首轮先做 OAuth2
- 只使用你给的 API
- 文档创建和删除参数正确
- CrownScript 使用 `multipart/form-data`
- 前端模板和 Python 分层稳定
- 运行按钮可启动
- 打包按钮可产出部署包

---

## 七、验收记录表

| 场景             | 是否通过 | 问题记录 |
| ---------------- | -------- | -------- |
| OAuth2 前置      | [ ]      |          |
| 文档创建         | [ ]      |          |
| 文档删除         | [ ]      |          |
| CrownScript 执行 | [ ]      |          |
| 模板与架构       | [ ]      |          |
| Run              | [ ]      |          |
| Package          | [ ]      |          |
| 整体验收         | [ ]      |          |

---

## 八、下一步建议

如果本轮通过，下一步建议继续补：

- 更多 CrownCAD API
- OAuth2 自动注入运行时客户端
- Run / Package 自定义命令配置
- 标准部署模板
- 环境变量模板
