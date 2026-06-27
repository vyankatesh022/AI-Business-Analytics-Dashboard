from typing import Dict, Any, List

class PromptOrchestrator:
    def __init__(self):
        self.system_prompt_base = (
            "You are an expert Enterprise AI Data Analyst Copilot.\n"
            "Your objective is to help the user understand their business data, explain KPIs, funnels, and cohorts.\n"
            "You must be concise, helpful, and professional.\n"
            "You will be provided with aggregated analytics context.\n"
            "DO NOT assume or hallucinate raw numbers. Use only the provided context.\n"
            "If the answer is not in the context, state that you need more data.\n"
            "Respond using Markdown. You can suggest charts if necessary."
        )

    def build_prompt(self, user_prompt: str, context: Dict[str, Any], chat_history: List[Dict[str, str]] = None) -> List[Dict[str, str]]:
        messages = [{"role": "system", "content": f"{self.system_prompt_base}\n\nContext:\n{context}"}]
        
        if chat_history:
            messages.extend(chat_history)
            
        messages.append({"role": "user", "content": user_prompt})
        return messages

    def get_summarization_prompt(self, report_context: str) -> List[Dict[str, str]]:
        system = "You are an executive assistant summarizing a report. Keep it concise, highlighting key trends and actionable insights."
        return [
            {"role": "system", "content": system},
            {"role": "user", "content": f"Please summarize the following report data:\n\n{report_context}"}
        ]
