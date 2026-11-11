---
title: "NIST AI 200-1: AI Use Taxonomy"
source: https://doi.org/10.6028/NIST.AI.200-1
source_date: 2024-03
processed_date: 2026-04-11
processor: docling
---

# NIST AI 200-1: AI Use Taxonomy

_A Human-Centered Approach_

Mary Theofanos, Yee-Yin Choong, Theodore Jensen

- Published: March 2024
- DOI: https://doi.org/10.6028/NIST.AI.200-1
- Citation: Mary Theofanos, Yee-Yin Choong, Theodore Jensen (2024) _AI Use Taxonomy: A Human-Centered Approach_. National Institute of Standards and Technology, Gaithersburg, MD. NIST AI 200-1.
- ORCID: Mary Theofanos `0000-0002-3209-6807`; Yee-Yin Choong `0000-0002-3889-6047`; Theodore Jensen `0000-0003-4969-4456`

## Abstract

As artificial intelligence (AI) systems continue to be developed, humans will increasingly participate in human-AI interactions. Humans interact with AI systems to achieve particular goals. To ensure that AI systems contribute positively to human-AI interactions, it is important to examine human-AI tasks with an emphasis on human goals and outcomes. The AI Use Taxonomy aims to provide a flexible means of classifying how an AI system contributes to an outcome. The taxonomy sets forward 16 AI use 'activities' which are independent of AI techniques and domains. Tasks are combinations of one or more AI use activities. Future research includes applying the taxonomy to better understand measurement challenges for each activity. The taxonomy can contribute to an improved understanding of the architecture of human-AI tasks and help to foster positive, human-centered interactions with AI systems and optimal outcomes in the following ways:

- Provides common terminology for describing outcome-based human-AI activities independent of AI techniques and domains
- Enables cross-domain insights based on shared human-AI activities
- Highlights commonalities in measurement and evaluation needs across disparate AI techniques
- Facilitates the development of use cases
- Facilitates the evaluation of trustworthiness characteristics and usability

## Keywords

Artificial intelligence; evaluation; human-centered AI; human-AI interaction; taxonomy; use case.

## 1. Introduction and Background

Artificial Intelligence (AI) has been rapidly developed and advanced across public and private sectors of the economy such as financial, marketing, healthcare, automobile, manufacturing, entertainment, and education domains. AI applications span from online interactions by consumers to highly specialized medical procedures by doctors. While AI holds promise for revolutionizing industries and enhancing our lives, it also poses a variety of societal and environmental risks. Thus, AI systems must be developed, deployed, and used in a trustworthy and responsible way to maximize the benefits and minimize the risks for individuals interacting with or affected by AI. As the research and development (R&D) community continues to advance AI technology, humans will increasingly interact with AI systems, i.e., human-AI interaction (HAII). HAII involves a paradigm shift from traditional human-computer interaction (HCI). In traditional HCI, a human user actively interacts with a computer system to perform activities and tasks toward predetermined outcomes. HAII differs from traditional HCI in three primary ways: 1) AI may partially or completely perform human activities and tasks; 2) human activities and tasks may be altered due to the presence of the AI system, and 3) HAII outcomes are highly contextdependent and non-deterministic. From the user's perspective, this paradigm shift results in a greater degree of unpredictability of the expected outcomes compared to traditional HCI. It is important for the R&D community to evaluate how the changes due to this paradigm shift manifest in unique risks and harms for individuals participating in human-AI interaction. The current document acts as an initial step in formalizing the roles that AI systems may play in human tasks to inform the systematic evaluation of risks and harms, as well as benefits, of AI systems. The NIST AI Risk Management Framework (RMF) 1.0  1  provides guidance for organizations developing and deploying AI systems on how to map, measure, manage, and govern the potential risks and harms introduced by AI. The RMF sets forth a set of characteristics which compose an AI system's overall trustworthiness, while advocating for a sociotechnical approach to AI risk management which emphasizes the interconnected nature of social, organizational, and computational factors in determining the extent of benefit and harm due to AI systems. The AI Use Taxonomy can contribute to an improved understanding of the architecture of human-AI tasks and help to evaluate and measure human-AI interactions to achieve optimal outcomes.

## Purpose

The AI Use Taxonomy aims to classify AI implementations into a useful structure which can aid measurement and evaluation of AI systems. For instance, the taxonomy can be leveraged for evaluating an AI system's usability in addition to the trustworthiness characteristics presented in the NIST AI RMF.

1  Tabassi, E. (2023), Artificial Intelligence Risk Management Framework (AI RMF 1.0), NIST Trustworthy and Responsible AI, National Institute of Standards and Technology, Gaithersburg, MD, [online], https://doi.org/10.6028/NIST.AI.100-1, (Accessed September 25, 2023)

The taxonomy decomposes complex human-AI tasks into activities that are independent of technological techniques (e.g., neural network, large language model, reinforcement learning) and domains (e.g., finance, medicine, law). Given this technique- and domain-independence, the AI Use Taxonomy will remain robust in the face of rapid technological advancement and the introduction of AI into new application areas.

Classification of AI use at the level of activities can facilitate and advance the overall evaluation and understanding of AI systems in the following ways:

- Provides common terminology for describing outcome-based human-AI activities independent of AI techniques and domains
- Enables cross-domain insights based on shared human-AI activities
- Highlights commonalities in measurement and evaluation needs across disparate AI techniques
- Facilitates the development of use cases
- Facilitates the evaluation of trustworthiness characteristics and usability

The taxonomy provides a flexible means of classifying an AI system's contribution to a specified human-AI task. The taxonomy is intended to be a living document that is updated periodically with feedback from stakeholders, such as those in the AI evaluation and human factors communities.

## Audience

This publication is intended to be used by AI actors performing tasks in AI design; AI development; AI deployment; operation and monitoring; test, evaluation, verification and validation (TEVV); human factors; domain experts; AI impact assessment; procurement; governance; and oversight, as listed in the NIST AI RMF 1.0.

## Definitions

For the purpose of the AI Use Taxonomy, the following terms and definitions apply. ISO 9241-11:2018 'Ergonomics of human-system interaction - Usability: Definitions and concepts' 2  helps to contextualize the AI Use Taxonomy around existing HCI standards. Like traditional HCI, human-AI interaction (HAII) still consists of a context of use in which a user conducts some task toward a specified goal :

Context of Use : combination of users, goals and tasks, resources, and environment

Note: The 'environment' in a context of use includes the technical, physical, social, cultural and organizational environments.

2  [ISO 9241-11:2018] International Standards Organization, ISO 9241-11, Ergonomics of human-system interaction - Part 11: Usability: Definitions and concepts, available at: https://www.iso.org/standard/63500.html

User : person who interacts with a system, product or service.

Note: Users of a system, product or service include people who operate the system, people who make use of the output of the system and people who support the system (including providing maintenance and training)

Goal

: intended outcome

Task

: set of activities undertaken in order to achieve a specific goal

Note 1: These activities can be physical, perceptual and/or cognitive.

Note 2: While goals are independent of the means used to achieve them, tasks describe particular means of achieving goals.

In HAII, a human-AI task is a set of human-AI activities undertaken to achieve a specified goal. Tasks are not performed by the user or the AI system alone. Human-AI activities require interaction or teaming between the user and the AI system to achieve the intended outcome.

## 2. Approach

The development of a taxonomy independent of AI techniques and domains requires a deeper understanding of the roles that AI systems play in the intended outcomes and human-AI tasks. The focus of the taxonomy is on the outcome or results of the user's interaction with an AI system, rather than focusing on how the user-interaction is executed. To develop categories of human-AI activities that provide necessary and sufficient representation to describe various types of AI use, an initial list of AI use activities was derived from common AI use cases in industry. The list was refined to achieve the desired balance of abstraction and specificity, and coverage of AI use. Moreover, to validate the taxonomy on AI research projects, several AI research repositories were examined, including NIST's AI Community of Interest's (COI) Project Catalogue-a repository of projects at NIST involving AI in some form, and lists of AI projects across the federal government. The exercise was used to determine if the set of activities provides necessary and sufficient representation of AI use cases. The taxonomy consists of a detailed set of 'human-AI activities' and their definitions. The activities can be viewed as functions describing how an AI system contributes to a human's overall task and intended outcomes. Each activity describes the manner in which the AI system augments or replaces human effort and maps to the goals of the user and their interaction with an AI system. Activities can be performed by a human or an AI system or both. The set of activities is intended to be used to describe the role or roles of the AI system in a given human-AI task (although the taxonomy could also feasibly be used to characterize the role or roles of human actors in the same task).

Each activity and its definition are shown below in

Table 1. Examples are provided to illustrate instances of AI systems performing each activity.

Table 1. Taxonomy of Human-AI Activities.

| Human-AI Activity            | Description The AI system assists by…                                                                                                                           | Example AI Outcomes Facilitating Human Goals                                                 |
|------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| Content creation             | generating new artifacts such as video, narrative, software code, synthetic data.                                                                               | subtitle creation; text-to-image                                                             |
| Content synthesis            | combining and/or summarizing parts, elements, or concepts into a coherent whole.                                                                                | converting doctors' unstructured notes; summarizing a book                                   |
| Decision making              | selecting a course of action from among possible alternatives in order to arrive at a solution.                                                                 | buy/sell financial decisions                                                                 |
| Detection                    | identifying, by careful search, examination, or probing, the existence or presence of [something].                                                              | detect cybersecurity threats                                                                 |
| Digital assistance           | acting as a personal agent for understanding and responding to commands and questions, and carrying out requested tasks in a conversational manner.             | reminders from smart assistants (e.g., Siri, Amazon Echo, Google Assistant, Bixby)           |
| Discovery                    | finding, recognizing, or unearthing something for the first time.                                                                                               | drug discovery and production                                                                |
| Image analysis               | recognizing attributes within digital images to extract meaningful information.                                                                                 | medical diagnostics                                                                          |
| Information retrieval/search | finding information about specific topics of interest.                                                                                                          | speed the search for stable proteins used in drug development, biofuels, and food production |
| Monitoring                   | observing, checking, and watching over the process, quality, or state of [something] over time to gain insights into how [something] is behaving or performing. | wildfire monitoring                                                                          |
| Performance improvement      | improving quality and efficiency of the intended outcomes.                                                                                                      | graph analytics; increasing efficiency and scalability for graph computing                   |
| Personalization              | designing and tailoring [something] to meet an individual's characteristics, preferences, or behaviors.                                                         | sales content personalization and analytics                                                  |
| Prediction                   | forecasting the likelihood of a future outcome.                                                                                                                 | sales forecasting; weather forecasting                                                       |
| Process automation           | performing repetitive tasks, removing bottlenecks, reducing errors and loss of data, and increasing efficiency of a process.                                    | automating administrative tasks                                                              |
| Recommendation               | suggesting or proposing a manageable set of viable options to aid decision-making.                                                                              | customer service response suggestions; purchase recommendations; content recommendations     |
| Robotic automation 3         | using physical machines to automate, improve, and/or optimize a variety of tasks.                                                                               | intelligent robots in surgery                                                                |
| Vehicular automation         | automating physical transportation of goods, instrumentation and/or people.                                                                                      | self-driving cars/trucks/trains; drones; spacecraft; airplanes                               |

While activities are defined distinctly, some are commonly associated with one another in realistic AI applications. For instance, the Decision-making activity may often contain some type of Prediction that precedes the final decision. Digital assistance , likewise, may involve Personalization as well as Recommendation . As a result, a human-AI task can be considered as a combination of one or more activities. An analysis of the activities carried out by the AI system can help to facilitate evaluation and organization of the task. Depending on how the taxonomy is applied to measurement and evaluation of AI systems, the primary activity performed by the AI system may be of greater interest to the researcher or practitioner than ancillary activities that support that primary activity. Alternatively, the overall combination of activities and their interactions with one another may be critical to the goals of measurement and evaluation.

## 3. Next Steps

The AI Use Taxonomy provides a sociotechnical lens to advance research, measurement and evaluation of AI systems which can contribute to trustworthy and responsible AI. Future research is necessary to validate the robustness of the taxonomy by applying it to use cases in various domains and employing various AI techniques. The taxonomy should also be validated across different stages of the AI lifecycle, such as design, deployment, TEVV, and impact assessment. The taxonomy may be updated based on assessments of its completeness and its value in evaluating AI systems.  This section describes two potential areas where the taxonomy should be applied to validate its usefulness.

## Measurement

Each AI Use activity is expected to carry unique implications for measurement and evaluation of AI systems. For instance, performance metrics and measurements for the Monitoring activity will likely differ from those for the Recommendation activity. Using the taxonomy can help to provide insights into the best indicators for performance with respect to the characteristics of trustworthy AI. For a single AI system which performs multiple activities, metrics describing performance for each activity may need to be combined into an overall performance metric. The method for such a combination over the set of activities performed is non-trivial and necessitates future research applying the AI Use Taxonomy to evaluating AI systems.

Due to the domain- and technique-independence of the taxonomy, insights into measurement for a given AI Use activity may apply across various AI domains. By organizing around an activity, findings relevant to measurement and evaluation in one domain may have application and relevance to other domains. Similarly, findings with respect to one AI technique may have implications for another technique.

3 Robotic automation and vehicular automation involve physical embodiment and represent a different level of abstraction than the other AI activities in the taxonomy but are included for completeness.

## Usability

Evaluation of AI system usability is one area that is expected to dovetail effectively with the AI Use Taxonomy. As human-AI interactions become more prevalent, with the increasingly recognized role of sociotechnical factors in trustworthy and responsible AI, there is a need to formalize practices around measuring AI system usability. The focus of the AI Use Taxonomy on human goals aligns with standard practices for evaluating the usability of interactive technological systems in terms of efficiency, effectiveness, and user satisfaction [see usability definitions in Appendix A]. As described with respect to performance metrics, each activity may carry unique implications for usability measurement, with different metrics being necessary for different users carrying out different activities in different contexts.

## Appendix A. Relevant Usability Definitions

In HCI, usability is considered an outcome of the user's interaction with the computer system in the specified context of use. It consists of three dimensions: effectiveness, efficiency, and satisfaction. Human-centered quality is another outcome of use which broadly consists of accessibility, user experience, and harm from use.  ISO 9241-11:2018, defines these outcomes as follows:

Usability : extent to which a system, product or service can be used by specified users to achieve specified goals with effectiveness, efficiency and satisfaction in a specified context of use

Effectiveness : accuracy and completeness with which users achieve specified goals

Efficiency : resources used in relation to the results achieved

Note: Typical resources include time, human effort (mental and/or physical), costs and materials.

Satisfaction : extent to which the user's physical, cognitive and emotional responses that result from the use of a system, product or service meet the user's needs and expectations

Note 1: Satisfaction includes the extent to which the user experience that results from actual use meets the user's needs and expectations.

Note 2: Anticipated use can influence satisfaction with actual use

Human-centred quality : extent to which requirements for usability, accessibility, user experience and avoidance of harm from use are met

Note 1: Provision of the necessary technical functionality is a prerequisite for human-centred quality.

Note 2: Usability, accessibility, user experience and avoidance of harm from use can only be managed to the extent that they can be controlled by designed aspects of the interactive system.

Note 3: Human-centred quality is a collective term for the intended outcomes of interaction of the user with the system.

Accessibility : extent to which products, systems, services, environments and facilities can be used by people from a population with the widest range of user needs, characteristics and capabilities to achieve identified goals in identified contexts of use

User Experience : user's perceptions and responses that result from the use and/or anticipated use of a system, product or service

Note: Users' perceptions and responses include the users' emotions, beliefs, preferences, perceptions, comfort, behaviours, and accomplishments that occur before, during and after use. Harm from use : negative consequences regarding health, safety, finances or the environment that result from use of the system Note: The negative consequences can be for the user or for any other stakeholder.
