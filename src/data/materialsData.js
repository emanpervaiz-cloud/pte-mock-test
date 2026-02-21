export const ESSAY_DATABASE = {
    "metadata": {
        "title": "PTE Academic Essay Template Database",
        "version": "1.0.0",
        "total_templates": 10,
        "language": "English",
        "level": "Academic",
        "target_exam": "PTE Academic",
        "scoring_criteria": [
            "Content",
            "Form",
            "Grammar",
            "Vocabulary",
            "Spelling"
        ],
        "recommended_word_count": {
            "min": 200,
            "max": 300,
            "ideal": 250
        },
        "placeholder_guide": {
            "{topic}": "The main subject or issue being discussed",
            "{reason}": "A supporting reason or justification",
            "{example}": "A real-world example, case study, or evidence",
            "{impact}": "The consequence, effect, or outcome",
            "{view_a}": "The first perspective or position",
            "{view_b}": "The second or opposing perspective",
            "{solution}": "A proposed remedy or course of action",
            "{group}": "A specific group of people, society, or institution",
            "{field}": "A domain such as education, health, technology, environment",
            "{cause}": "A root reason or contributing factor",
            "{benefit}": "A positive outcome or advantage",
            "{drawback}": "A negative outcome or disadvantage",
            "{policy}": "A governmental or institutional measure",
            "{statistic}": "A numerical fact, figure, or research finding",
            "{country}": "A nation used as a reference point or case study",
            "{outcome}": "The result of an action or policy",
            "{position}": "The writer's personal stance or argument",
            "{agent}": "The responsible party — government, schools, individuals, etc."
        }
    },
    "templates": [
        {
            "id": "TPL-001",
            "title": "Agree or Disagree",
            "essay_type": "Opinion",
            "difficulty": "Intermediate",
            "tags": ["opinion", "argument", "position", "agree", "disagree"],
            "description": "Used when the prompt asks the writer to state and defend a personal opinion on a given issue.",
            "structure_guide": "State position clearly → Support with evidence → Address counterargument → Reinforce position → Conclude",
            "frames": {
                "introduction": [
                    {
                        "frame_id": "TPL-001-INT-01",
                        "frame": "In contemporary society, the question of whether {topic} has become a subject of considerable debate. While many people believe that {view_a}, I am firmly of the opinion that {position}. This essay will outline the key reasons behind this view.",
                        "tone": "formal",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-001-INT-02",
                        "frame": "The issue of {topic} continues to provoke strong opinions across {field}. Although some argue that {view_a}, a careful examination of the evidence suggests that {position}. The following paragraphs will explore this argument in detail.",
                        "tone": "analytical",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-001-INT-03",
                        "frame": "Few topics generate as much discussion as {topic}. Proponents of {view_a} present compelling points, yet when all factors are considered, it becomes clear that {position}. This essay will defend this stance with reasoned argument and relevant evidence.",
                        "tone": "assertive",
                        "sentence_count": 3
                    }
                ],
                "body_paragraph_1": [
                    {
                        "frame_id": "TPL-001-BP1-01",
                        "frame": "The most persuasive argument in favour of {position} is that {reason}. This is clearly illustrated by {example}, which demonstrates that {impact}. Furthermore, when {group} is considered, the evidence strongly supports the view that {position}.",
                        "focus": "Main supporting argument",
                        "tone": "formal",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-001-BP1-02",
                        "frame": "A key reason to support {position} lies in the fact that {reason}. Studies conducted in {field} have consistently shown that {statistic}, confirming that {impact}. This evidence makes a compelling case for {position}.",
                        "focus": "Evidence-based argument",
                        "tone": "academic",
                        "sentence_count": 3
                    }
                ],
                "body_paragraph_2": [
                    {
                        "frame_id": "TPL-001-BP2-01",
                        "frame": "Admittedly, critics contend that {view_a}, citing {reason} as their primary justification. This perspective is understandable, given that {example}. However, it overlooks the critical point that {impact}, which ultimately renders this objection unconvincing.",
                        "focus": "Counterargument and refutation",
                        "tone": "balanced",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-001-BP2-02",
                        "frame": "Opponents of this view argue that {view_a}. While this concern is not without merit, it fails to account for {reason}. In practice, as seen in {example}, {impact}, thereby weakening the counterargument considerably.",
                        "focus": "Rebuttal with evidence",
                        "tone": "formal",
                        "sentence_count": 3
                    }
                ],
                "conclusion": [
                    {
                        "frame_id": "TPL-001-CON-01",
                        "frame": "In conclusion, having considered both sides of the argument, it is evident that {position}. Although {view_a} raises valid concerns, the weight of evidence points firmly towards {outcome}. It is therefore essential that {agent} take decisive steps to {solution}.",
                        "tone": "decisive",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-001-CON-02",
                        "frame": "To summarise, the case for {position} is a strong one. While no single perspective can capture the full complexity of {topic}, the arguments presented here demonstrate that {outcome} is both necessary and achievable. A commitment to {solution} will be vital going forward.",
                        "tone": "optimistic",
                        "sentence_count": 3
                    }
                ]
            }
        },
        {
            "id": "TPL-002",
            "title": "Advantages and Disadvantages",
            "essay_type": "Balanced Discussion",
            "difficulty": "Intermediate",
            "tags": ["advantages", "disadvantages", "balanced", "pros", "cons"],
            "description": "Used when the prompt asks the writer to objectively discuss both the benefits and drawbacks of a given topic without necessarily stating a personal opinion.",
            "structure_guide": "Introduce topic neutrally → Explore advantages → Explore disadvantages → Offer balanced conclusion",
            "frames": {
                "introduction": [
                    {
                        "frame_id": "TPL-002-INT-01",
                        "frame": "The rise of {topic} has transformed {field} in significant ways. Like most developments of this kind, it brings both notable benefits and serious drawbacks. This essay will examine both sides of the issue before arriving at a balanced assessment.",
                        "tone": "neutral",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-002-INT-02",
                        "frame": "{topic} has emerged as one of the most widely discussed phenomena in {field} today. While it offers {group} a range of opportunities, it also introduces challenges that cannot be ignored. Both dimensions will be explored in the paragraphs that follow.",
                        "tone": "formal",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-002-INT-03",
                        "frame": "In recent years, {topic} has attracted considerable attention due to its wide-ranging implications for {field}. A fair assessment requires consideration of both its advantages and disadvantages, and this essay sets out to provide precisely that.",
                        "tone": "academic",
                        "sentence_count": 2
                    }
                ],
                "body_paragraph_1": [
                    {
                        "frame_id": "TPL-002-BP1-01",
                        "frame": "On the one hand, {topic} offers several compelling advantages. Foremost among these is {benefit}, which has enabled {group} to {outcome}. Additionally, {reason} means that {impact}, further strengthening the case that {topic} can be a powerful force for positive change in {field}.",
                        "focus": "Advantages",
                        "tone": "positive",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-002-BP1-02",
                        "frame": "The benefits of {topic} are both wide-ranging and well-documented. In particular, {benefit} has had a measurable effect on {group}, as evidenced by {example}. Furthermore, {reason}, which has contributed to {impact} across {field}.",
                        "focus": "Evidence-supported advantages",
                        "tone": "academic",
                        "sentence_count": 3
                    }
                ],
                "body_paragraph_2": [
                    {
                        "frame_id": "TPL-002-BP2-01",
                        "frame": "On the other hand, the drawbacks of {topic} should not be underestimated. The most pressing concern is {drawback}, which poses a direct threat to {group}. Compounding this is {reason}, which can result in {impact} if left unaddressed. These challenges suggest that a more regulated approach to {topic} may be required.",
                        "focus": "Disadvantages",
                        "tone": "cautionary",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-002-BP2-02",
                        "frame": "Despite its merits, {topic} is not without significant shortcomings. Chief among these is {drawback}, particularly for {group} who may lack the resources to adapt. Moreover, {reason} has led to {impact}, raising legitimate concerns about the long-term sustainability of reliance on {topic}.",
                        "focus": "Critical disadvantages",
                        "tone": "balanced",
                        "sentence_count": 3
                    }
                ],
                "conclusion": [
                    {
                        "frame_id": "TPL-002-CON-01",
                        "frame": "In conclusion, {topic} is a development that presents both significant opportunities and real challenges. While {benefit} represents a clear gain for {group}, concerns surrounding {drawback} must be addressed with appropriate safeguards. A measured and evidence-led approach will be essential to maximise its potential.",
                        "tone": "balanced",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-002-CON-02",
                        "frame": "To summarise, the advantages and disadvantages of {topic} are closely intertwined. The {benefit} it offers is undeniable, yet so too are the risks associated with {drawback}. Going forward, {agent} must work collaboratively to ensure that the benefits are realised without exacerbating existing inequalities.",
                        "tone": "pragmatic",
                        "sentence_count": 3
                    }
                ]
            }
        },
        {
            "id": "TPL-003",
            "title": "Discuss Both Views and Give Your Opinion",
            "essay_type": "Discursive Opinion",
            "difficulty": "Upper Intermediate",
            "tags": ["both views", "opinion", "discuss", "perspectives", "hybrid"],
            "description": "Used when the prompt presents two contrasting views and asks the writer to discuss both and then state their own opinion.",
            "structure_guide": "Present both views → Develop view A → Develop view B with personal stance → Conclude with opinion",
            "frames": {
                "introduction": [
                    {
                        "frame_id": "TPL-003-INT-01",
                        "frame": "The topic of {topic} has long divided opinion. While one school of thought holds that {view_a}, others maintain that {view_b}. Although both perspectives have their merits, I personally believe that {position}, and this essay will explain why.",
                        "tone": "discursive",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-003-INT-02",
                        "frame": "There is ongoing debate about {topic}, with some people arguing that {view_a} and others claiming that {view_b}. Both viewpoints carry weight, yet a closer examination reveals that {position}. This essay will discuss each view before presenting a reasoned conclusion.",
                        "tone": "formal",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-003-INT-03",
                        "frame": "Views on {topic} differ considerably. Supporters of {view_a} and advocates of {view_b} each present persuasive arguments. After weighing the evidence, however, I am inclined to agree that {position}, and the paragraphs below will outline the reasoning behind this stance.",
                        "tone": "reflective",
                        "sentence_count": 3
                    }
                ],
                "body_paragraph_1": [
                    {
                        "frame_id": "TPL-003-BP1-01",
                        "frame": "Those who believe that {view_a} argue that {reason}. This view is supported by {example}, which demonstrates that {impact}. Proponents further contend that without considering {reason}, any solution to {topic} will remain incomplete.",
                        "focus": "View A — objective presentation",
                        "tone": "neutral",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-003-BP1-02",
                        "frame": "Supporters of {view_a} point to {reason} as the cornerstone of their argument. Evidence from {field} indicates that {example}, lending credibility to this perspective. It is a viewpoint that, on the surface at least, carries considerable logic.",
                        "focus": "View A with evidence",
                        "tone": "measured",
                        "sentence_count": 3
                    }
                ],
                "body_paragraph_2": [
                    {
                        "frame_id": "TPL-003-BP2-01",
                        "frame": "Conversely, advocates of {view_b} contend that {reason}. They highlight {example} as clear evidence that {impact}. From my own perspective, this argument is more convincing because {reason}, and I believe that {position} offers the most practical path forward for {group}.",
                        "focus": "View B with personal opinion",
                        "tone": "assertive",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-003-BP2-02",
                        "frame": "On the other side of the debate, those who argue that {view_b} emphasise {reason}. Real-world examples from {country} demonstrate that {example}, which has resulted in {impact}. In my view, this evidence makes {view_b} the more defensible of the two positions.",
                        "focus": "View B with country example and opinion",
                        "tone": "academic",
                        "sentence_count": 3
                    }
                ],
                "conclusion": [
                    {
                        "frame_id": "TPL-003-CON-01",
                        "frame": "In conclusion, both {view_a} and {view_b} offer valuable insights into the complex matter of {topic}. Nevertheless, I maintain that {position} is the more compelling stance, as it better addresses {impact}. Ultimately, progress in {field} will depend on the willingness of {agent} to embrace {solution}.",
                        "tone": "opinionated",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-003-CON-02",
                        "frame": "To conclude, the debate surrounding {topic} reflects deeper tensions within {field}. While I acknowledge the legitimacy of {view_a}, the evidence more strongly supports {position}. Going forward, it is this perspective that should guide policy and practice in {field}.",
                        "tone": "decisive",
                        "sentence_count": 3
                    }
                ]
            }
        },
        {
            "id": "TPL-004",
            "title": "Cause and Effect",
            "essay_type": "Analytical",
            "difficulty": "Upper Intermediate",
            "tags": ["cause", "effect", "consequence", "analytical", "explanatory"],
            "description": "Used when the prompt asks the writer to identify the reasons behind a trend or problem and explore its consequences.",
            "structure_guide": "Introduce issue → Identify causes → Explore effects → Recommend responses in conclusion",
            "frames": {
                "introduction": [
                    {
                        "frame_id": "TPL-004-INT-01",
                        "frame": "The growing prevalence of {topic} has become one of the most pressing concerns in {field} today. Understanding why this phenomenon has emerged, and what consequences it carries, is essential for {agent} seeking to develop effective responses. This essay will analyse the primary causes of {topic} and examine its far-reaching effects.",
                        "tone": "analytical",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-004-INT-02",
                        "frame": "{topic} has become increasingly common in {field}, prompting urgent questions about its origins and impact. A thorough understanding of both the causes and effects of this trend is critical if {group} is to respond meaningfully. The following paragraphs will explore each dimension in turn.",
                        "tone": "formal",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-004-INT-03",
                        "frame": "In recent decades, {topic} has intensified significantly, affecting {group} across {field}. To address this issue effectively, it is necessary to first examine what has driven it and what consequences have followed. This essay will provide a structured analysis of both causes and effects.",
                        "tone": "objective",
                        "sentence_count": 3
                    }
                ],
                "body_paragraph_1": [
                    {
                        "frame_id": "TPL-004-BP1-01",
                        "frame": "Several interrelated factors have contributed to the rise of {topic}. The most significant cause is {cause}, which has been driven by {reason}. Compounding this is {example}, a trend that has further accelerated {impact}. Together, these forces have created conditions in which {topic} has become increasingly difficult to contain.",
                        "focus": "Causes",
                        "tone": "analytical",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-004-BP1-02",
                        "frame": "The roots of {topic} can be traced to a combination of {cause} and {reason}. In {field}, {example} has played a particularly important role in fuelling this trend. Without addressing these underlying drivers, any attempt to resolve {topic} is likely to fall short.",
                        "focus": "Root causes with examples",
                        "tone": "academic",
                        "sentence_count": 3
                    }
                ],
                "body_paragraph_2": [
                    {
                        "frame_id": "TPL-004-BP2-01",
                        "frame": "The consequences of {topic} are both wide-ranging and deeply concerning. In the short term, {impact} has placed considerable strain on {group}, as evidenced by {example}. Over the longer term, if current trends continue, {topic} threatens to produce {drawback}, which will have lasting implications for {field}.",
                        "focus": "Short and long-term effects",
                        "tone": "cautionary",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-004-BP2-02",
                        "frame": "The effects of {topic} on {group} have been substantial. Most immediately, {impact} has disrupted {field}, creating additional burdens for {agent}. Furthermore, {example} illustrates how the ripple effects of {topic} extend well beyond its immediate context, affecting {outcome} in ways that demand urgent attention.",
                        "focus": "Cascading effects",
                        "tone": "analytical",
                        "sentence_count": 3
                    }
                ],
                "conclusion": [
                    {
                        "frame_id": "TPL-004-CON-01",
                        "frame": "In summary, {topic} is a multifaceted issue rooted in {cause} and characterised by far-reaching effects on {group}. Tackling it requires a coordinated response from {agent}, addressing both the underlying drivers and the emerging consequences. If appropriate action is taken, there is reason to hope that {outcome} can be achieved within {field}.",
                        "tone": "solution-oriented",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-004-CON-02",
                        "frame": "To conclude, the causes and effects of {topic} are deeply interconnected. Without addressing {cause} at its source, the effects — particularly {impact} — will continue to intensify. A proactive and evidence-based strategy is therefore the most effective means of securing a better {outcome} for {group}.",
                        "tone": "urgent",
                        "sentence_count": 3
                    }
                ]
            }
        },
        {
            "id": "TPL-005",
            "title": "Problem and Solution",
            "essay_type": "Problem-Solution",
            "difficulty": "Intermediate",
            "tags": ["problem", "solution", "measures", "recommendations", "policy"],
            "description": "Used when the prompt asks the writer to identify problems associated with a topic and propose realistic, effective solutions.",
            "structure_guide": "Introduce the problem → Examine key problems in detail → Propose solutions with reasoning → Conclude with recommendation",
            "frames": {
                "introduction": [
                    {
                        "frame_id": "TPL-005-INT-01",
                        "frame": "{topic} represents one of the most significant challenges facing {group} today. Without effective intervention, this issue risks causing lasting harm to {field}. This essay will identify the core problems associated with {topic} and put forward a series of viable, evidence-based solutions.",
                        "tone": "purposeful",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-005-INT-02",
                        "frame": "The problem of {topic} has grown to alarming proportions in {field}, with serious consequences for {group}. Addressing this challenge is no longer optional — it is a matter of urgency. This essay will outline the key dimensions of the problem and propose practical measures that {agent} can implement.",
                        "tone": "urgent",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-005-INT-03",
                        "frame": "It is widely acknowledged that {topic} poses a serious and growing threat to {field}. The complexity of the issue means that no single measure will suffice; rather, a comprehensive and coordinated response is required. This essay will examine the nature of the problem and recommend targeted solutions.",
                        "tone": "formal",
                        "sentence_count": 3
                    }
                ],
                "body_paragraph_1": [
                    {
                        "frame_id": "TPL-005-BP1-01",
                        "frame": "The issue of {topic} manifests in several interconnected ways. The most critical problem is {drawback}, which disproportionately affects {group} due to {cause}. This is further compounded by {reason}, which limits the capacity of {agent} to respond effectively. Unless these underlying issues are addressed, the situation is likely to deteriorate further.",
                        "focus": "Identifying and explaining problems",
                        "tone": "analytical",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-005-BP1-02",
                        "frame": "Several distinct problems characterise the challenge of {topic}. Foremost is {drawback}, which has been documented extensively in {field} and is particularly acute for {group}. Additionally, {reason} creates structural barriers that prevent {outcome}, making the situation increasingly difficult to manage without external intervention.",
                        "focus": "Structural problems",
                        "tone": "academic",
                        "sentence_count": 3
                    }
                ],
                "body_paragraph_2": [
                    {
                        "frame_id": "TPL-005-BP2-01",
                        "frame": "Addressing these problems requires a coordinated, multi-level response. In the first instance, {solution} could be implemented by {agent}, which would directly reduce {impact}. In addition, {example} from {country} demonstrates that {reason} is an effective strategy that has yielded measurable improvements in {field}. These measures, if adopted systematically, offer a credible pathway to resolution.",
                        "focus": "Proposing and evidencing solutions",
                        "tone": "solution-oriented",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-005-BP2-02",
                        "frame": "A range of practical solutions exists to counter the problems described above. Most immediately, {solution} would provide {group} with the support they need to cope with {drawback}. Over the longer term, {policy} implemented at the {agent} level has proven effective in {example}, suggesting that similar approaches could deliver {outcome} in other contexts.",
                        "focus": "Short and long-term solutions",
                        "tone": "pragmatic",
                        "sentence_count": 3
                    }
                ],
                "conclusion": [
                    {
                        "frame_id": "TPL-005-CON-01",
                        "frame": "In conclusion, while the challenges posed by {topic} are considerable, they are by no means insurmountable. Through the implementation of {solution} and a long-term commitment to {policy}, {agent} can create the conditions necessary for {outcome}. The cost of inaction far outweighs the investment required to act, and the time to do so is now.",
                        "tone": "motivational",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-005-CON-02",
                        "frame": "To summarise, {topic} is a serious issue that demands serious solutions. The problems of {drawback} and {cause} require urgent attention from {agent}, backed by adequate resources and political will. With the right approach, {outcome} is not merely aspirational — it is achievable.",
                        "tone": "decisive",
                        "sentence_count": 3
                    }
                ]
            }
        },
        {
            "id": "TPL-006",
            "title": "Technology and Society",
            "essay_type": "Thematic — Technology",
            "difficulty": "Intermediate",
            "tags": ["technology", "society", "innovation", "digital", "impact"],
            "description": "Designed specifically for essay prompts relating to the effects of technology on individuals, communities, and society at large.",
            "structure_guide": "Introduce technology's role → Examine positive impact → Examine negative impact or risk → Advocate for balanced adoption",
            "frames": {
                "introduction": [
                    {
                        "frame_id": "TPL-006-INT-01",
                        "frame": "Technological innovation has fundamentally reshaped {field}, and {topic} is no exception. While these advances present extraordinary opportunities for {group}, they also raise legitimate concerns about {drawback}. This essay will assess both the positive and negative dimensions of {topic} and argue that a regulated approach is essential.",
                        "tone": "balanced",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-006-INT-02",
                        "frame": "The rapid development of {topic} has prompted widespread debate about its implications for {group} and {field}. Advocates point to {benefit} as a transformative advantage, while critics warn of {drawback}. This essay will examine both perspectives and assess the extent to which {topic} serves the public good.",
                        "tone": "analytical",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-006-INT-03",
                        "frame": "In an era defined by rapid change, {topic} has emerged as one of the most consequential developments in {field}. Its potential to transform {group}'s experience of {field} is immense, yet so too are the risks it presents. A careful and nuanced assessment is therefore needed to determine how {topic} should be governed and used.",
                        "tone": "formal",
                        "sentence_count": 3
                    }
                ],
                "body_paragraph_1": [
                    {
                        "frame_id": "TPL-006-BP1-01",
                        "frame": "There is little doubt that {topic} has brought transformative benefits to {field}. Most notably, {benefit} has enabled {group} to {outcome}, dramatically improving efficiency and accessibility. This is exemplified by {example}, where the integration of {topic} has delivered measurable gains in {impact}.",
                        "focus": "Positive impact of technology",
                        "tone": "positive",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-006-BP1-02",
                        "frame": "The advantages of {topic} extend across multiple dimensions of {field}. For {group}, {benefit} has created new opportunities that were previously unimaginable, as seen in {example}. Moreover, {reason} means that {impact}, underlining the capacity of technology to act as a powerful driver of progress.",
                        "focus": "Breadth of technological benefits",
                        "tone": "optimistic",
                        "sentence_count": 3
                    }
                ],
                "body_paragraph_2": [
                    {
                        "frame_id": "TPL-006-BP2-01",
                        "frame": "Nevertheless, the rapid adoption of {topic} is not without risk. A growing body of research suggests that {drawback} poses a serious challenge, particularly for {group} who may be ill-equipped to navigate its consequences. Additionally, {reason} raises concerns about {impact}, highlighting the need for robust regulatory frameworks to govern the use of {topic}.",
                        "focus": "Risks and regulatory need",
                        "tone": "cautionary",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-006-BP2-02",
                        "frame": "Despite its promise, {topic} presents genuine challenges that must not be dismissed. Chief among these is {drawback}, which threatens to undermine {outcome} for {group}. Furthermore, the pace of technological change often outstrips the capacity of {agent} to respond, leaving {field} vulnerable to {impact} in the interim.",
                        "focus": "Systemic risks of rapid adoption",
                        "tone": "measured",
                        "sentence_count": 3
                    }
                ],
                "conclusion": [
                    {
                        "frame_id": "TPL-006-CON-01",
                        "frame": "In conclusion, {topic} is a powerful development that holds immense promise for {field}, provided its risks are managed responsibly. While {benefit} represents a genuine step forward for {group}, the challenges of {drawback} require proactive governance. With thoughtful regulation and informed use, {topic} can serve as a genuine force for good.",
                        "tone": "balanced",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-006-CON-02",
                        "frame": "To conclude, the impact of {topic} on {field} is profound and far-reaching. Rather than embracing or rejecting it wholesale, {agent} must pursue a path that captures {benefit} while actively mitigating {drawback}. Only through this balanced approach can technology fulfil its potential as an instrument of human progress.",
                        "tone": "pragmatic",
                        "sentence_count": 3
                    }
                ]
            }
        },
        {
            "id": "TPL-007",
            "title": "Environment and Sustainability",
            "essay_type": "Thematic — Environment",
            "difficulty": "Upper Intermediate",
            "tags": ["environment", "sustainability", "climate", "pollution", "conservation"],
            "description": "Designed for essay prompts related to environmental issues, climate change, conservation, and ecological responsibility.",
            "structure_guide": "Establish environmental urgency → Analyse scale and responsibility → Propose solutions → Call to action in conclusion",
            "frames": {
                "introduction": [
                    {
                        "frame_id": "TPL-007-INT-01",
                        "frame": "Environmental degradation and the urgent need for sustainability have emerged as defining challenges of our time. The issue of {topic} sits at the heart of this global crisis, threatening {group} and the ecosystems upon which all life depends. This essay will examine the scale of the problem and argue that immediate and coordinated action is essential.",
                        "tone": "urgent",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-007-INT-02",
                        "frame": "The consequences of {topic} for the natural world are both well-documented and deeply alarming. As {field} continues to face mounting pressure from human activity, the question of who bears responsibility for {solution} becomes ever more critical. This essay will assess the problem and propose meaningful responses.",
                        "tone": "analytical",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-007-INT-03",
                        "frame": "Few issues carry the moral and practical urgency of {topic}. Its impact on {field} is already being felt by {group} around the world, and projections suggest that the situation will worsen without decisive intervention. This essay will explore the root causes of the problem and evaluate the most effective responses available to {agent}.",
                        "tone": "formal",
                        "sentence_count": 3
                    }
                ],
                "body_paragraph_1": [
                    {
                        "frame_id": "TPL-007-BP1-01",
                        "frame": "The environmental consequences of {topic} are both severe and wide-ranging. Rising levels of {cause} have led to {impact}, placing immense strain on {group} and the ecosystems they depend upon. Scientific consensus, supported by evidence from {example}, makes clear that without immediate structural change, the damage will be irreversible.",
                        "focus": "Environmental problem and evidence",
                        "tone": "scientific",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-007-BP1-02",
                        "frame": "The impact of {topic} on {field} cannot be overstated. Over recent decades, {cause} has accelerated the pace of environmental decline, resulting in {impact} that threatens {group}'s long-term security. This crisis demands an urgent and systemic response from {agent} rather than incremental, piecemeal measures.",
                        "focus": "Urgency and systemic failure",
                        "tone": "urgent",
                        "sentence_count": 3
                    }
                ],
                "body_paragraph_2": [
                    {
                        "frame_id": "TPL-007-BP2-01",
                        "frame": "Addressing {topic} requires coordinated action at every level of society. At the governmental level, {policy} — as demonstrated effectively in {country} — has proven capable of reducing {impact} significantly. At the individual level, {solution} offers a practical means by which {group} can contribute to {outcome}, creating a collective response proportionate to the scale of the challenge.",
                        "focus": "Multi-level solutions",
                        "tone": "solution-oriented",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-007-BP2-02",
                        "frame": "Sustainable progress on {topic} depends on a combination of innovation, legislation, and behavioural change. Renewable alternatives to {cause} are now both technologically feasible and economically viable, as demonstrated by {example}. Simultaneously, {policy} can incentivise {group} to adopt more environmentally responsible practices, driving {outcome} at scale.",
                        "focus": "Innovation and policy synergy",
                        "tone": "optimistic",
                        "sentence_count": 3
                    }
                ],
                "conclusion": [
                    {
                        "frame_id": "TPL-007-CON-01",
                        "frame": "In conclusion, {topic} is an existential challenge that demands an equally serious response. The science is unambiguous, the consequences are already being felt, and the window for effective action is narrowing. By committing to {solution} and holding {agent} accountable, society can begin to chart a more sustainable course for {field}.",
                        "tone": "rallying",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-007-CON-02",
                        "frame": "To conclude, protecting {field} from the consequences of {topic} is not merely a policy choice — it is a moral imperative. The solutions are known and available; what is needed now is the collective will to implement them. With decisive action from {agent} and sustained commitment from {group}, a more sustainable future remains within reach.",
                        "tone": "motivational",
                        "sentence_count": 3
                    }
                ]
            }
        },
        {
            "id": "TPL-008",
            "title": "Education and Society",
            "essay_type": "Thematic — Education",
            "difficulty": "Intermediate",
            "tags": ["education", "learning", "schools", "curriculum", "access", "students"],
            "description": "Designed for essay prompts about education systems, learning methods, access to education, and the role of schools in society.",
            "structure_guide": "Introduce education issue → Develop core argument → Address opposing view → Conclude with recommendation",
            "frames": {
                "introduction": [
                    {
                        "frame_id": "TPL-008-INT-01",
                        "frame": "Education is widely recognised as the foundation of individual opportunity and social progress. The question of {topic}, however, continues to generate significant debate among educators, policymakers, and families alike. This essay will argue that {position} and outline the evidence that supports this view.",
                        "tone": "formal",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-008-INT-02",
                        "frame": "Access to quality education is fundamental to the development of {group} and the prosperity of {field}. Yet the issue of {topic} reveals deep tensions within current educational systems. This essay will examine these tensions and make the case for {solution} as the most equitable and effective response.",
                        "tone": "critical",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-008-INT-03",
                        "frame": "The debate surrounding {topic} reflects broader questions about the purpose and structure of education in modern society. While traditionalists advocate for {view_a}, reformers argue that {view_b} better serves the needs of {group} in the twenty-first century. This essay will assess both perspectives and offer a reasoned conclusion.",
                        "tone": "balanced",
                        "sentence_count": 3
                    }
                ],
                "body_paragraph_1": [
                    {
                        "frame_id": "TPL-008-BP1-01",
                        "frame": "The most compelling argument in support of {position} is that {reason}. Research from {field} consistently demonstrates that {example}, confirming that {impact} for {group}. When educational systems prioritise {solution}, learners — particularly those from disadvantaged backgrounds — are far better positioned to reach their potential.",
                        "focus": "Core argument with research",
                        "tone": "evidence-based",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-008-BP1-02",
                        "frame": "There is strong evidence to suggest that {position} leads to measurably better outcomes in {field}. In {country}, the introduction of {policy} resulted in {impact}, with {group} showing marked improvements in {example}. These findings suggest that {solution} is not only theoretically sound but demonstrably effective in practice.",
                        "focus": "Policy impact with country example",
                        "tone": "academic",
                        "sentence_count": 3
                    }
                ],
                "body_paragraph_2": [
                    {
                        "frame_id": "TPL-008-BP2-01",
                        "frame": "Critics of {position} argue that {view_a}, citing {reason} as their primary concern. While this objection has some validity, it fails to account for {example}, which shows that {impact} when {solution} is properly implemented. Ultimately, the evidence suggests that the benefits of {position} far outweigh the risks raised by its detractors.",
                        "focus": "Counterargument and rebuttal",
                        "tone": "persuasive",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-008-BP2-02",
                        "frame": "Some educators contend that {view_a} is preferable because {reason}. This concern deserves acknowledgement, particularly in contexts where {group} faces significant barriers to {outcome}. However, the weight of evidence from {example} indicates that {solution} addresses these very barriers more effectively than the current approach.",
                        "focus": "Nuanced rebuttal",
                        "tone": "balanced",
                        "sentence_count": 3
                    }
                ],
                "conclusion": [
                    {
                        "frame_id": "TPL-008-CON-01",
                        "frame": "In conclusion, the debate over {topic} ultimately centres on the kind of society we wish to build. The evidence strongly supports {position} as the approach most likely to deliver equitable and lasting {outcome} for {group}. To realise this vision, {agent} must invest in {solution} as a matter of priority.",
                        "tone": "visionary",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-008-CON-02",
                        "frame": "To summarise, education is too important an issue to be left to convention alone. The case for {position} is supported by compelling evidence from {field}, and the time has come for {agent} to act on this evidence. Only by doing so can we ensure that every member of {group} has access to the education they deserve.",
                        "tone": "advocating",
                        "sentence_count": 3
                    }
                ]
            }
        },
        {
            "id": "TPL-009",
            "title": "Government and Individual Responsibility",
            "essay_type": "Rights and Responsibilities",
            "difficulty": "Advanced",
            "tags": ["government", "individual", "responsibility", "policy", "freedom", "rights"],
            "description": "Designed for prompts that ask who — government or individuals — should bear primary responsibility for addressing a social issue.",
            "structure_guide": "Introduce the responsibility question → Make case for government role → Acknowledge individual role → Argue for shared model",
            "frames": {
                "introduction": [
                    {
                        "frame_id": "TPL-009-INT-01",
                        "frame": "The question of who bears primary responsibility for addressing {topic} — governments or individuals — lies at the heart of many contemporary policy debates. While individuals can make meaningful contributions, the structural nature of {topic} means that {agent} intervention is indispensable. This essay will argue that {position} and explore why a shared responsibility model offers the most effective solution.",
                        "tone": "political",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-009-INT-02",
                        "frame": "When it comes to {topic}, opinions differ sharply on the role of government versus that of the individual. Those who favour limited government intervention argue that {view_a}, while others contend that {view_b}. This essay will assess both positions and conclude that {position} represents the most equitable and effective approach.",
                        "tone": "discursive",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-009-INT-03",
                        "frame": "In modern democracies, the boundary between state responsibility and personal freedom is constantly contested. Nowhere is this tension more apparent than in the debate over {topic}. This essay will examine the obligations of both {agent} and {group} in addressing {topic} and argue that {position} is the most credible path forward.",
                        "tone": "formal",
                        "sentence_count": 3
                    }
                ],
                "body_paragraph_1": [
                    {
                        "frame_id": "TPL-009-BP1-01",
                        "frame": "There is a strong case for placing primary responsibility for {topic} with {agent}. Given the systemic nature of the problem, individual action alone cannot produce {outcome} at the necessary scale. Governments possess the legislative authority, financial capacity, and institutional reach to implement {policy}, as evidenced by the success of {example} in {country}.",
                        "focus": "Government responsibility",
                        "tone": "authoritative",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-009-BP1-02",
                        "frame": "Governments are uniquely positioned to address {topic} because of their ability to {reason}. Through targeted {policy}, {agent} can create the structural conditions in which {outcome} becomes possible for all of {group}, regardless of their individual circumstances. Without such intervention, inequalities in {field} will inevitably persist.",
                        "focus": "Structural justification for government action",
                        "tone": "policy-focused",
                        "sentence_count": 3
                    }
                ],
                "body_paragraph_2": [
                    {
                        "frame_id": "TPL-009-BP2-01",
                        "frame": "At the same time, individual responsibility must not be overlooked. When {group} is empowered with the knowledge and resources to address {topic}, meaningful behavioural change follows, as demonstrated by {example}. An over-reliance on government intervention risks creating {drawback}, such as dependency or reduced personal agency. A sustainable model therefore combines {policy} with individual empowerment through education and awareness.",
                        "focus": "Individual responsibility and risk of over-dependence",
                        "tone": "balanced",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-009-BP2-02",
                        "frame": "While government action provides the structural foundation, lasting progress on {topic} ultimately requires the active participation of {group}. Evidence from {country} suggests that when individuals understand the {impact} of their choices regarding {topic}, they are more likely to adopt {solution} voluntarily. This synergy between policy and individual agency is the cornerstone of any effective response.",
                        "focus": "Complementary roles",
                        "tone": "collaborative",
                        "sentence_count": 3
                    }
                ],
                "conclusion": [
                    {
                        "frame_id": "TPL-009-CON-01",
                        "frame": "In conclusion, neither {agent} nor individuals can address {topic} effectively in isolation. A shared responsibility model — in which government provides {policy} while individuals are supported to make {solution} — represents the most pragmatic and equitable approach. With commitment from both sides, {outcome} in {field} is not only possible but likely.",
                        "tone": "collaborative",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-009-CON-02",
                        "frame": "To conclude, the responsibility for {topic} must be distributed thoughtfully between {agent} and {group}. While government must lead with structural reform and {policy}, individuals must be empowered — not coerced — to play their part. This balanced partnership is the surest foundation for lasting {outcome} in {field}.",
                        "tone": "balanced",
                        "sentence_count": 3
                    }
                ]
            }
        },
        {
            "id": "TPL-010",
            "title": "Globalisation and Cultural Identity",
            "essay_type": "Thematic — Global Issues",
            "difficulty": "Advanced",
            "tags": ["globalisation", "culture", "identity", "diversity", "tradition", "homogenisation"],
            "description": "Designed for essay prompts exploring the tension between global integration and the preservation of local cultures, traditions, and languages.",
            "structure_guide": "Introduce globalisation tension → Examine threats to cultural identity → Counter with opportunities and resilience → Advocate for balanced integration",
            "frames": {
                "introduction": [
                    {
                        "frame_id": "TPL-010-INT-01",
                        "frame": "Globalisation has accelerated the flow of ideas, goods, and cultures across borders at an unprecedented pace. While this integration has generated shared prosperity, it has also raised profound questions about the survival of {topic} in the face of dominant global forces. This essay will evaluate the extent to which globalisation threatens {group}'s cultural identity and propose ways of achieving a constructive balance.",
                        "tone": "reflective",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-010-INT-02",
                        "frame": "The tension between global interconnectedness and local cultural identity is one of the defining issues of our era. As {topic} spreads across {field}, {group} must confront the challenge of preserving what is unique about their heritage while participating in a rapidly changing world. This essay will examine both the risks and opportunities this dynamic presents.",
                        "tone": "philosophical",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-010-INT-03",
                        "frame": "Globalisation has reshaped cultures in ways both celebrated and contested. For many {group}, the spread of {topic} represents an opportunity for connection and exchange; for others, it signals a threat to {example} that has defined their communities for generations. This essay will argue that {position} and outline the steps needed to ensure cultural diversity is not sacrificed at the altar of global integration.",
                        "tone": "nuanced",
                        "sentence_count": 3
                    }
                ],
                "body_paragraph_1": [
                    {
                        "frame_id": "TPL-010-BP1-01",
                        "frame": "Critics of globalisation rightly argue that the dominance of {topic} has eroded local cultures in significant ways. In {country}, for instance, {example} has diminished as younger generations increasingly align with global trends at the expense of {group}'s traditional practices. This cultural homogenisation risks creating a world of diminished diversity, where the richness of human civilisation is gradually replaced by a uniform global culture.",
                        "focus": "Cultural erosion through globalisation",
                        "tone": "critical",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-010-BP1-02",
                        "frame": "The pressures exerted by globalisation on {topic} are real and should not be minimised. As {field} becomes increasingly dominated by {reason}, {group} face the risk of losing the cultural markers — including {example} — that have shaped their collective identity over generations. Without deliberate efforts to preserve these traditions, the next generation may inherit a world diminished by cultural uniformity.",
                        "focus": "Identity loss and generational impact",
                        "tone": "cautionary",
                        "sentence_count": 3
                    }
                ],
                "body_paragraph_2": [
                    {
                        "frame_id": "TPL-010-BP2-01",
                        "frame": "However, globalisation also creates meaningful opportunities for cultural exchange and reinvention. The international success of {example} demonstrates that local cultures need not be passive victims of global forces; they can, in fact, use platforms of global reach to assert and share their identity with wider audiences. Furthermore, {policy} aimed at promoting cultural education and linguistic diversity has helped {country} maintain a strong sense of national identity without sacrificing the benefits of global participation.",
                        "focus": "Cultural resilience and opportunity",
                        "tone": "optimistic",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-010-BP2-02",
                        "frame": "Globalisation, when managed thoughtfully, need not come at the cost of cultural identity. Digital technologies have empowered {group} to document, disseminate, and celebrate {topic} in ways that were previously impossible, reaching audiences far beyond their geographical borders. Additionally, {solution} — including government-supported cultural programmes and inclusive {field} curricula — can ensure that younger generations remain connected to their heritage even as they engage with the wider world.",
                        "focus": "Digital empowerment and policy solutions",
                        "tone": "solution-oriented",
                        "sentence_count": 3
                    }
                ],
                "conclusion": [
                    {
                        "frame_id": "TPL-010-CON-01",
                        "frame": "In conclusion, {topic} is a challenge and an opportunity for {topic}. Rather than viewing these forces as inevitably opposed, {group} and {agent} alike should pursue a model of engagement that celebrates shared humanity while protecting what is distinctive about each culture. A world that embraces both unity and diversity is not merely an ideal — with deliberate policy and genuine commitment, it is achievable.",
                        "tone": "idealistic yet practical",
                        "sentence_count": 3
                    },
                    {
                        "frame_id": "TPL-010-CON-02",
                        "frame": "To summarise, the fate of {topic} in the age of globalisation will be determined by the choices made by {agent} and {group} today. Whilst the pressures of cultural homogenisation are real, so too are the tools available to resist them. Through {solution} and a renewed commitment to cultural education, it is possible to build a globalised world that does not come at the cost of the diverse traditions that give humanity its depth and character.",
                        "tone": "affirming",
                        "sentence_count": 3
                    }
                ]
            }
        }
    ],
    "linking_phrases": {
        "adding_information": [
            "Furthermore", "In addition", "Moreover", "Additionally",
            "Not only this, but also", "What is more", "Similarly", "Equally important"
        ],
        "contrasting": [
            "However", "Nevertheless", "Notwithstanding this", "On the contrary",
            "Despite this", "Conversely", "Although", "Whilst", "In contrast"
        ],
        "giving_examples": [
            "For instance", "To illustrate", "A case in point is",
            "This is exemplified by", "As demonstrated by", "In particular", "For example"
        ],
        "cause_and_effect": [
            "Consequently", "As a result", "This leads to", "Owing to",
            "Due to", "Stemming from", "This has precipitated", "Thus", "Therefore"
        ],
        "conceding": [
            "Admittedly", "It must be acknowledged that", "While it is true that",
            "Granted", "To be sure", "One cannot deny that", "Whilst this is the case"
        ],
        "concluding": [
            "In conclusion", "To summarise", "On balance", "Taking everything into consideration",
            "Ultimately", "To conclude", "In summary", "Having considered all factors"
        ]
    },
    "vocabulary_bands": {
        "advanced": [
            "ubiquitous", "exacerbate", "mitigate", "proliferation", "disparate",
            "inequitable", "holistic", "ramifications", "unprecedented", "imperative",
            "systemic", "convergence", "pragmatic", "multifaceted", "sustainable"
        ],
        "upper_intermediate": [
            "significant", "considerable", "demonstrate", "indicate", "contribute",
            "acknowledge", "advocate", "implement", "assess", "undermine",
            "constitute", "facilitate", "generate", "reinforce", "address"
        ],
        "useful_academic_phrases": [
            "a growing body of evidence suggests",
            "research consistently demonstrates",
            "this is particularly evident in",
            "the weight of evidence points to",
            "it is widely acknowledged that",
            "a nuanced understanding reveals",
            "the data strongly supports",
            "this claim is substantiated by",
            "far-reaching implications",
            "a critical examination of"
        ]
    }
};

export const CATEGORIES = [
    {
        id: 'templates',
        title: '📝 Essay Templates',
        color: '#e3f2fd',
        items: [
            { title: 'Universal Essay Template', size: '1.2 MB', type: 'PDF' },
            { title: 'Describe Image Structures', size: '0.8 MB', type: 'PDF' },
            { title: 'Retell Lecture Keywords', size: '0.5 MB', type: 'PDF' },
        ]
    },
    {
        id: 'guides',
        title: '📖 Study Guides',
        color: '#f3e5f5',
        items: [
            { title: 'PTE 79+ Strategy Guide', size: '3.5 MB', type: 'PDF' },
            { title: 'Grammar Cheat Sheet', size: '1.1 MB', type: 'PDF' },
            { title: 'Collocation List 2024', size: '2.0 MB', type: 'PDF' },
        ]
    },
    {
        id: 'audio',
        title: '🎧 Audio Practice',
        color: '#e8f5e9',
        items: [
            { title: 'Real Test Audio Samples', size: '15 MB', type: 'ZIP' },
            { title: 'Dictation High Frequency', size: '8 MB', type: 'ZIP' },
        ]
    }
];

export const ESSAY_RUBRIC = {
    "rubric_meta": {
        "title": "PTE Academic Essay — AI Evaluation Rubric",
        "version": "3.0.0",
        "created": "2026-02-20",
        "description": "A fully machine-readable, web-app-ready scoring rubric for AI-powered evaluation of PTE Academic Respond to Prompt essays.",
        "dynamic_placeholders": {
            "{essay}": "The full text of the candidate's submitted essay",
            "{topic}": "The original prompt or question presented to the candidate",
            "{length}": "The integer word count of the submitted essay",
            "{criterion}": "The name of the criterion currently being evaluated",
            "{score}": "The numeric score assigned to a criterion",
            "{feedback}": "The generated feedback string for a criterion",
            "{strongest}": "The criterion with the highest score",
            "{weakest}": "The criterion with the lowest score"
        },
        "ai_prompt_template": "You are a certified PTE Academic examiner. Evaluate the following essay written in response to the prompt below. Score each criterion independently using the rubric provided. Return your evaluation as a valid JSON object matching the output_schema.\n\nPROMPT: {topic}\n\nESSAY: {essay}\n\nWORD COUNT: {length}\n\nReturn ONLY valid JSON. Do not include explanations outside the JSON object.",
        "total_score": 45,
        "passing_threshold": 30,
        "score_to_pte_band": [
            { "range": "41–45", "band": "Expert", "pte_equivalent": "85–90", "passed": true },
            { "range": "35–40", "band": "Advanced", "pte_equivalent": "72–84", "passed": true },
            { "range": "27–34", "band": "Upper Intermediate", "pte_equivalent": "58–71", "passed": true },
            { "range": "18–26", "band": "Intermediate", "pte_equivalent": "43–57", "passed": false },
            { "range": "9–17", "band": "Elementary", "pte_equivalent": "25–42", "passed": false },
            { "range": "0–8", "band": "Below Standard", "pte_equivalent": "0–24", "passed": false }
        ]
    },
    "criteria": [
        {
            "id": "CR-01",
            "name": "Content Relevance",
            "key": "content_relevance",
            "max_score": 10,
            "weight_percent": 22,
            "description": "Measures how directly and completely {essay} addresses {topic}.",
            "evaluation_prompt": "Read {essay} written in response to {topic}. Evaluate only Content Relevance.",
            "scoring_guide": {
                "high": {
                    "score_range": "8–10",
                    "label": "Excellent — Fully On-Topic and Well-Argued",
                    "description": "The essay directly and completely addresses every aspect of {topic}.",
                    "examples": [
                        "Essay prompt asks whether social media harms mental health. Essay states a clear position...",
                        "Essay on remote work benefits presents one argument per paragraph with a clear topic sentence..."
                    ],
                    "ai_detection_signals": [
                        "Prompt keywords appear meaningfully",
                        "A thesis statement is detectable",
                        "Each body paragraph has a distinct argument",
                        "At least one specific, named example",
                        "Conclusion does not introduce new arguments"
                    ]
                },
                "medium": {
                    "score_range": "4–7",
                    "label": "Satisfactory",
                    "description": "The essay addresses {topic} at a general level but misses specific aspects.",
                    "ai_detection_signals": [
                        "Prompt keywords appear but central question only partially answered",
                        "Position is implied rather than explicitly stated"
                    ]
                },
                "low": {
                    "score_range": "0–3",
                    "label": "Inadequate",
                    "description": "The essay fails to meaningfully address {topic}."
                }
            },
            "score_matrix": [
                { "score": 10, "descriptor": "All aspects of topic addressed; strong thesis; two fully developed arguments; specific examples; excellent conclusion" },
                { "score": 5, "descriptor": "Topic partially addressed; position implied; limited argument development; little evidence" },
                { "score": 0, "descriptor": "Completely off-topic, blank, or plagiarised" }
            ],
            "red_flags": [
                "Essay does not mention the topic at all",
                "Same argument repeated",
                "Position changes between paragraphs"
            ]
        },
        {
            "id": "CR-02",
            "name": "Grammar Accuracy",
            "key": "grammar_accuracy",
            "max_score": 10,
            "weight_percent": 22,
            "description": "Evaluates the accuracy, range, and complexity of grammatical structures.",
            "error_taxonomy": {
                "major_errors": { "definition": "Errors that distort meaning", "penalty_per_error": -1.5 },
                "minor_errors": { "definition": "Errors that do not impede meaning", "penalty_per_error": -0.5 }
            },
            "scoring_guide": {
                "high": {
                    "score_range": "8–10",
                    "label": "Excellent",
                    "description": "The essay demonstrates full control of a wide range of grammatical structures."
                },
                "medium": {
                    "score_range": "4–7",
                    "label": "Satisfactory",
                    "description": "The essay communicates meaning effectively but shows noticeable grammatical errors."
                },
                "low": {
                    "score_range": "0–3",
                    "label": "Inadequate",
                    "description": "Grammatical errors are so frequent that comprehension is often impaired."
                }
            }
        },
        {
            "id": "CR-03",
            "name": "Vocabulary & Word Choice",
            "key": "vocabulary_word_choice",
            "max_score": 10,
            "weight_percent": 22,
            "description": "Assesses the range, precision, and appropriateness of vocabulary.",
            "detection_metrics": {
                "academic_register_words": {
                    "example_academic_words": ["proliferation", "exacerbate", "mitigate", "unprecedented", "systemic"]
                },
                "spelling_penalties": [
                    { "errors": 0, "penalty": 0 },
                    { "errors": "6+", "penalty": -2.5 }
                ]
            },
            "scoring_guide": {
                "high": { "score_range": "8–10", "label": "Excellent" },
                "medium": { "score_range": "4–7", "label": "Satisfactory" },
                "low": { "score_range": "0–3", "label": "Inadequate" }
            }
        },
        {
            "id": "CR-04",
            "name": "Coherence & Cohesion",
            "key": "coherence_cohesion",
            "max_score": 10,
            "weight_percent": 22,
            "description": "Evaluates how logically and fluently {essay} is organised.",
            "structural_requirements": {
                "ideal_structure": [
                    { "paragraph": 1, "name": "Introduction" },
                    { "paragraph": 2, "name": "Body 1" },
                    { "paragraph": 3, "name": "Body 2" },
                    { "paragraph": 4, "name": "Conclusion" }
                ],
                "linking_device_library": {
                    "additive": ["furthermore", "moreover", "in addition"],
                    "contrastive": ["however", "nevertheless", "on the other hand"]
                }
            },
            "scoring_guide": {
                "high": { "score_range": "8–10", "label": "Excellent" },
                "medium": { "score_range": "4–7", "label": "Satisfactory" },
                "low": { "score_range": "0–3", "label": "Inadequate" }
            }
        },
        {
            "id": "CR-05",
            "name": "Word Count Appropriateness",
            "key": "word_count",
            "max_score": 5,
            "weight_percent": 11,
            "description": "Evaluates whether the essay length falls within the range of 200–300 words.",
            "target_range": { "minimum_acceptable": 200, "maximum_acceptable": 300 },
            "scoring_guide": {
                "high": { "score_range": "5", "label": "Ideal" },
                "medium": { "score_range": "3–4", "label": "Acceptable" },
                "low": { "score_range": "0–2", "label": "Unacceptable" }
            }
        }
    ],
    "evaluation_logic": {
        "formula": "final_score = Sum of all criteria",
        "score_bands": [
            { "range": "41–45", "band": "Expert", "pte_equivalent": "85–90" },
            { "range": "35–40", "band": "Advanced", "pte_equivalent": "72–84" },
            { "range": "27–34", "band": "Upper Intermediate", "pte_equivalent": "58–71" }
        ]
    },
    "ideal_essay_checklist": [
        { "item": "Word count is between 220–270 words", "criterion": "word_count" },
        { "item": "Essay has exactly 4 paragraphs", "criterion": "coherence_cohesion" },
        { "item": "Introduction contains a clear thesis statement", "criterion": "content_relevance" }
    ]
};
