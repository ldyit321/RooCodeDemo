# RooCode 提示词体系图

这份图基于 [`roo-prompts-annotated.zh-CN.md`](d:/lidongyaosproject/RooCodeDemo/Roo-Code/docs/roo-prompts-annotated.zh-CN.md) 整理，目标不是逐字摘录，而是把 RooCode 的提示词系统按“来源 -> 拼装 -> 运行 -> 纠偏”画成一张能快速建立心智模型的结构图。

建议在 VS Code Markdown Preview 中查看，`Mermaid` 图会更清晰。

## 1. 总体体系图

```mermaid
flowchart TD
    A[用户输入] --> B[Task 主循环]
    B --> C[构造本轮上下文]

    subgraph Context["上下文构造层"]
        C1[历史消息 apiConversationHistory]
        C2[environment_details]
        C3[mentions slash command 预处理]
        C4[当前 mode / profile / tool restrictions]
    end

    C --> C1
    C --> C2
    C --> C3
    C --> C4

    B --> D[SYSTEM_PROMPT 拼装]

    subgraph PromptAssembly["系统提示词拼装层 src/core/prompts/system.ts"]
        D1[markdown-formatting]
        D2[tool-use]
        D3[tool-use-guidelines]
        D4[capabilities]
        D5[modes]
        D6[skills]
        D7[rules]
        D8[system-info]
        D9[objective]
        D10[custom-instructions]
    end

    D --> D1
    D --> D2
    D --> D3
    D --> D4
    D --> D5
    D --> D6
    D --> D7
    D --> D8
    D --> D9
    D --> D10

    subgraph DynamicSources["动态注入源"]
        S1[内置 mode persona<br/>packages/types/src/mode.ts]
        S2[用户 customInstructions]
        S3[项目规则 .roo/rules* / .roorules / .clinerules]
        S4[AGENTS.md / AGENT.md / AGENTS.local.md]
        S5[SkillsManager 提供的技能清单]
        S6[MCP server 描述]
    end

    S1 --> D5
    S2 --> D10
    S3 --> D10
    S4 --> D10
    S5 --> D6
    S6 --> D4

    D --> E[构造可用工具列表]

    subgraph Tools["工具提示词层 src/core/prompts/tools/native-tools/"]
        T1[read_file / search_files / list_files]
        T2[edit / edit_file / apply_diff / write_to_file]
        T3[execute_command / read_command_output]
        T4[ask_followup_question / attempt_completion]
        T5[switch_mode / new_task / update_todo_list / skill]
        T6[mcp_server 动态工具描述]
    end

    E --> T1
    E --> T2
    E --> T3
    E --> T4
    E --> T5
    E --> T6

    C --> F[发送给模型]
    D --> F
    E --> F

    F --> G{模型返回}
    G -->|普通文本| H[assistant 消息]
    G -->|tool_use| I[本地工具执行]

    I --> J[tool_result 回灌模型]
    J --> F

    subgraph RuntimeRepair["运行时纠偏层 src/core/prompts/responses.ts"]
        R1[noToolsUsed]
        R2[missingToolParameterError]
        R3[toolError]
        R4[MCP denied / tool denied / structured error]
    end

    I -->|工具参数缺失/执行失败/行为跑偏| RuntimeRepair
    RuntimeRepair --> J

    subgraph SidePrompts["旁路辅助提示词 src/shared/support-prompt.ts"]
        P1[ENHANCE]
        P2[CONDENSE]
        P3[EXPLAIN]
        P4[FIX]
        P5[IMPROVE]
        P6[ADD_TO_CONTEXT]
        P7[TERMINAL_*]
        P8[NEW_TASK]
    end

    A -. 某些 UI 操作/辅助入口 .-> SidePrompts
    SidePrompts -. 生成补充消息或辅助任务 .-> B
```

## 2. 系统主提示词堆栈图

这个图只看 `SYSTEM_PROMPT` 本体，强调“谁在定义 RooCode 的人格、边界和工作方式”。

```mermaid
flowchart TB
    SP[SYSTEM_PROMPT]

    SP --> M1[1. markdown-formatting<br/>输出格式规则]
    SP --> M2[2. tool-use<br/>必须通过工具完成任务]
    SP --> M3[3. tool-use-guidelines<br/>工具调用方法论]
    SP --> M4[4. capabilities<br/>能力边界与 MCP 能力说明]
    SP --> M5[5. modes<br/>当前 mode 的角色定位]
    SP --> M6[6. skills<br/>当前 mode 可用技能清单]
    SP --> M7[7. rules<br/>文件编辑、命令执行、安全约束]
    SP --> M8[8. system-info<br/>运行环境信息]
    SP --> M9[9. objective<br/>本轮总体目标]
    SP --> M10[10. custom-instructions<br/>用户/项目/代理规则注入]

    M5 --> X1[architect / code / ask / debug / orchestrator]
    M6 --> X2[SkillsManager 按 mode 过滤后的技能]
    M10 --> X3[Global Instructions]
    M10 --> X4[Mode-specific Instructions]
    M10 --> X5[.roo/rules 与 legacy rules]
    M10 --> X6[AGENTS.md / AGENT.md / AGENTS.local.md]
```

## 3. 运行时行为图

这个图强调：RooCode 不是“提示词一次成型”，而是“提示词 + 工具 + 错误纠偏”的循环系统。

```mermaid
sequenceDiagram
    participant U as 用户
    participant T as Task 循环
    participant P as SYSTEM_PROMPT
    participant M as 模型
    participant X as 本地工具执行器
    participant R as responses.ts

    U->>T: 输入任务
    T->>P: 拼装系统提示词
    T->>M: system + history + tools
    M-->>T: assistant 文本 / tool_use

    alt 返回 tool_use
        T->>X: 执行工具
        X-->>T: tool_result / error
        alt 成功
            T->>M: 回灌 tool_result
        else 失败或跑偏
            T->>R: 生成纠偏提示
            R-->>T: noToolsUsed / toolError / missing param
            T->>M: 回灌纠偏消息
        end
    else 返回普通文本
        T-->>U: 展示消息
    end
```

## 4. 你可以怎么理解这套体系

- `modes.ts` 决定“我是谁”。它给 RooCode 当前模式的人格、职责和适用场景。
- `rules.ts` 和 `tool-use*.ts` 决定“我怎么做事”。它们约束必须优先读文件、调用工具、谨慎编辑、避免跳步。
- `objective.ts` 决定“我当前要完成什么”。它更像任务导向的总目标段。
- `custom-instructions.ts` 决定“项目现场怎么改写默认行为”。它把用户偏好、仓库规则、`AGENTS.md`、`.roo/rules` 全部叠加进去。
- `native-tools/*` 决定“模型知道自己有哪些手和脚”。这些不是普通说明文，而是工具 schema 的自然语言接口描述。
- `responses.ts` 决定“做错了以后怎么拉回来”。这部分很关键，它让 RooCode 形成带纠偏能力的闭环。
- `support-prompt.ts` 不直接属于主任务循环的 system prompt，但它服务于增强输入、压缩上下文、解释终端、创建新任务等旁路能力。

## 5. 对应源码位置

- 系统主拼装入口：
  [`src/core/prompts/system.ts`](d:/lidongyaosproject/RooCodeDemo/Roo-Code/src/core/prompts/system.ts)
- 主提示词分段：
  [`src/core/prompts/sections/`](d:/lidongyaosproject/RooCodeDemo/Roo-Code/src/core/prompts/sections)
- 内置模式：
  [`packages/types/src/mode.ts`](d:/lidongyaosproject/RooCodeDemo/Roo-Code/packages/types/src/mode.ts)
- 运行时纠偏：
  [`src/core/prompts/responses.ts`](d:/lidongyaosproject/RooCodeDemo/Roo-Code/src/core/prompts/responses.ts)
- 辅助提示词：
  [`src/shared/support-prompt.ts`](d:/lidongyaosproject/RooCodeDemo/Roo-Code/src/shared/support-prompt.ts)
- 工具描述：
  [`src/core/prompts/tools/native-tools/`](d:/lidongyaosproject/RooCodeDemo/Roo-Code/src/core/prompts/tools/native-tools)

## 6. 一句话总结

RooCode 的提示词体系不是单个 system prompt，而是一个由“主提示词堆栈 + mode persona + 项目规则注入 + 工具描述 + 运行时纠偏提示”组成的分层控制系统。
