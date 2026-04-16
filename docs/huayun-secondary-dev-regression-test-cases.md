# HUAYUN Secondary Dev 回归测试用例

本文档用于验证 `HUAYUN Secondary Dev` 是否按当前约定线路工作：

`Mode -> Runtime Settings -> Workspace Rules -> Module Rule -> Thin Skill / AGENTS -> API Understanding -> Implementation / Tool Actions`

这套回归不追求“大而全”，而是优先验证最容易回退、最影响稳定性的关键点。

## 使用前提

- 每条测试都建议在`全新任务`中执行
- 当前 mode 必须为 `huayun-secondary-dev`
- 如果刚改完 rules / mode / prompt 相关内容，先 `Reload Window`
- 每条先看“是否正确理解规则和接口”，再看“是否生成代码”

## 判定总原则

优先观察以下几点：

- 是否先按当前项目规则材料做判断
- 是否把 `thin skill` 只当导航层
- 是否把 `AGENTS.md` 只当仓库级补充
- 是否正确命中已知 API
- 是否在缺失能力时停止并说明，而不是发明接口
- 是否把规则结论和业务代码实现状态区分开

常见失败信号：

- 先搜业务代码，再倒推 API 是否存在
- 因为没找到 wrapper / route / service 就说接口不存在
- 把 skill 或 AGENTS 当成主要 API 真相源
- 不区分同一路径不同 HTTP method 的语义
- 输出 `missing API`、`501`、`not implemented`，但实际上规则里已定义该能力

---

## 回归测试 A：线路入口验证

### 目标

验证模型是否理解当前 HUAYUN 二开的约束优先级。

### 提示词

```text
请检查当前项目规则材料里，HUAYUN 二开的 API 真相优先看哪里，skill 和 AGENTS 分别是什么角色。
```

### 通过标准

- 明确先说 `current workspace rules`
- 能指出主来源是 `.roo/rules-huayun-secondary-dev/`
- 说明 `skill` 是薄导航层
- 说明 `AGENTS.md` 是仓库级补充，不是 API 真相源

### 失败信号

- 把 skill 说成主要 API 来源
- 把 `AGENTS.md` 说成主要 API 定义来源
- 跳过规则，先讲业务代码里有没有实现

- [ ] 通过

---

## 回归测试 B：规则优先于实现代码

### 目标

验证模型会先回答“规则里是否定义”，而不是先看业务实现。

### 提示词

```text
请判断：根据 ProjectId 查询项目文档列表，这个能力在当前项目规则材料里是否已定义。先回答规则结论，再说业务代码里是否已有实现。
```

### 通过标准

- 先回答“规则里已定义”
- 命中 `GET /api/document/project/{projectId}`
- 之后才补充业务代码是否已有实现

### 失败信号

- 先去搜 `src` / `webview-ui`
- 因为没找到实现就说 missing
- 不给规则结论，只给代码结论

- [ ] 通过

---

## 回归测试 C1：项目文档列表

### 目标

验证文档管理规则是否按新线路正确命中项目文档列表接口。

### 提示词

```text
Utilizing the HUAYUN secondary development framework, implement project document listing by ProjectId.
```

### 应命中接口

- `GET /api/document/project/{projectId}`

### 失败信号

- `missing API`
- `501`
- `not implemented`
- 错误映射到 `GET /api/document/`
- 错误映射到 folder API

- [ ] 通过

---

## 回归测试 C2：文档详情

### 目标

验证文档详情能力是否优先命中规则中的已知接口。

### 提示词

```text
Utilizing the HUAYUN secondary development framework, implement document detail retrieval by DocumentId.
```

### 应命中接口

- `GET /api/document/{documentId}`

### 失败信号

- 声称缺失接口
- 映射到项目文档列表
- 映射到批量查询接口

- [ ] 通过

---

## 回归测试 C3：文档重命名

### 目标

验证文档重命名是否优先命中固定语义映射。

### 提示词

```text
Utilizing the HUAYUN secondary development framework, implement document rename by DocumentId.
```

### 应命中接口

- `POST /api/document/rename`

### 额外观察点

- 是否提到 `documentId`
- 是否提到 `documentName`

### 失败信号

- 映射到 folder rename
- 映射到 create document
- 声称 rename 能力缺失

- [ ] 通过

---

## 回归测试 C4：文档创建

### 目标

验证基础创建能力没有被新线路误伤。

### 提示词

```text
Utilizing the HUAYUN secondary development framework, implement document creation.
```

### 应命中接口

- `POST /api/document/`

### 失败信号

- 映射到 detail / list / rename
- 声称创建能力缺失

- [ ] 通过

---

## 回归测试 D1：BOM 属性列表

### 目标

验证 `Method + Path` 约束在 BOM 上仍然有效。

### 提示词

```text
请实现根据 documentId 查询文档属性列表。
```

### 应命中接口

- `GET /api/bom/documentAttributeManifest`

### 失败信号

- 只看 path，不区分 method
- 把查询映射到 `POST` / `PUT` / `DELETE`

- [ ] 通过

---

## 回归测试 D2：BOM 新增属性

### 提示词

```text
请实现新增一条文档属性。
```

### 应命中接口

- `POST /api/bom/documentAttributeManifest`

### 失败信号

- 映射到 `GET`
- 映射到 `PUT`

- [ ] 通过

---

## 回归测试 D3：BOM 修改属性

### 提示词

```text
请实现修改已有文档属性。
```

### 应命中接口

- `PUT /api/bom/documentAttributeManifest`

### 失败信号

- 映射到 `POST`
- 映射到 `GET`

- [ ] 通过

---

## 回归测试 D4：BOM 删除属性

### 提示词

```text
请实现删除一条文档属性。
```

### 应命中接口

- `DELETE /api/bom/documentAttributeManifest`

### 失败信号

- 映射到非 `DELETE`

- [ ] 通过

---

## 回归测试 E：Folder 与 FolderDocument 边界

### 目标

验证系统 Folder 和文档型 FolderDocument 没有被混用。

### 提示词 1

```text
请实现系统文件夹重命名。
```

### 应命中接口

- `PATCH /api/folder/{folderId}/name`

### 提示词 2

```text
请实现项目内文档树文件夹创建。
```

### 通过标准

- 不把两者当成同一个资源
- 能区分 `Folder` 与 `FolderDocument`
- 如果当前材料不足，能说明边界或缺失点

### 失败信号

- 只要看到 folder 就统一用 `/api/folder`
- 混淆系统文件夹和项目内文档文件夹

- [ ] 通过

---

## 回归测试 F：组合场景

### 目标

验证单能力命中在组合任务里不会退化。

### 提示词

```text
请使用 HUAYUN Secondary Dev 模式实现一个文档管理工具，支持：
- query project documents by ProjectId
- create document
- get document detail by DocumentId
- rename document by DocumentId

Use the current known document-management APIs and do not treat these capabilities as missing.
```

### 应同时命中接口

- `GET /api/document/project/{projectId}`
- `POST /api/document/`
- `GET /api/document/{documentId}`
- `POST /api/document/rename`

### 失败信号

- 只抓住 `create document`
- 把其余三项判成 missing
- 组合任务里又退回到旧推理路径

- [ ] 通过

---

## 回归测试 G：缺失 API 停止规则

### 目标

验证在规则未定义能力时，模型会显式停止并说明。

### 提示词

```text
请实现项目列表查询，并调用当前 CrownCAD 上游项目列表接口。
```

### 通过标准

- 明确说当前规则材料未提供该 API
- 说明 closest known APIs
- 说明哪些部分可 scaffold
- 说明哪些 code path blocked

### 失败信号

- 发明 `/api/project`
- 发明 generic project list endpoint
- 假装上游已存在该接口

- [ ] 通过

---

## 建议执行顺序

建议按下面顺序执行：

1. A
2. B
3. C1
4. C2
5. C3
6. C4
7. D1
8. D2
9. D3
10. D4
11. E
12. F
13. G

## 最小判定表

- A 过：说明入口优先级正确
- B 过：说明“规则优先于代码”正确
- C 过：说明文档管理能力识别稳定
- D 过：说明 `Method + Path` 仍然稳定
- E 过：说明资源边界稳定
- F 过：说明组合推理稳定
- G 过：说明 missing-stop 没被破坏

## 回归记录表

| 用例 | 验证点                       | 是否通过 | 问题记录 |
| ---- | ---------------------------- | -------- | -------- |
| A    | 线路入口优先级               | [ ]      |          |
| B    | 规则优先于实现代码           | [ ]      |          |
| C1   | 项目文档列表                 | [ ]      |          |
| C2   | 文档详情                     | [ ]      |          |
| C3   | 文档重命名                   | [ ]      |          |
| C4   | 文档创建                     | [ ]      |          |
| D1   | BOM 属性列表                 | [ ]      |          |
| D2   | BOM 新增属性                 | [ ]      |          |
| D3   | BOM 修改属性                 | [ ]      |          |
| D4   | BOM 删除属性                 | [ ]      |          |
| E    | Folder / FolderDocument 边界 | [ ]      |          |
| F    | 组合场景稳定性               | [ ]      |          |
| G    | 缺失 API 停止规则            | [ ]      |          |
