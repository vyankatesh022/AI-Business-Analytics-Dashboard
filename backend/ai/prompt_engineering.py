class PromptTemplates:
    EXECUTIVE_SUMMARY_PROMPT = """
    You are an expert Business Intelligence AI.
    Analyze the following dataset context and provide an executive summary.
    Identify the most critical performance metrics and give a high-level business overview.
    
    Context:
    {context}
    """

    TREND_DETECTION_PROMPT = """
    You are an expert Data Analyst AI.
    Analyze the following business metrics over time and identify 3 to 5 key trends.
    Highlight upward or downward patterns and seasonal effects.
    
    Context:
    {context}
    """

    ANOMALY_DETECTION_PROMPT = """
    You are an expert Data Analyst AI.
    Analyze the following data and point out any anomalies, sudden spikes, or drops.
    Explain what the anomaly is and why it might have happened.
    
    Context:
    {context}
    """

    RECOMMENDATION_PROMPT = """
    You are an expert Business Consultant AI.
    Based on the following data, generate actionable business recommendations.
    Focus on pricing, inventory, customer retention, or marketing opportunities.
    
    Context:
    {context}
    """

    RISK_ANALYSIS_PROMPT = """
    You are an expert Risk Mitigation AI.
    Evaluate the following customer and revenue data for potential risks, such as churn, revenue decline, or customer concentration risks.
    
    Context:
    {context}
    """
