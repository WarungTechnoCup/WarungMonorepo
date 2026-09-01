# Competition requirements

This tracker converts the ITechnoCup 2026 Web Development guidebook into reviewable work. Page references use the PDF page number. The official PDF remains outside Git.

Source hashes:

- Guidebook PDF SHA-256: `efa0fac5054676ffc9cb8896325bff54aee03cdf79debae1c7af4758c7173229`
- Developer specification SHA-256: `f73186edd392e22c21099248d94566cdef28bc025f68a54b0fc8fe6a47352245`

Status values are `Complete`, `Pending`, `Blocked`, and `Organizer confirmation`.

## Eligibility and implementation

| Check | Requirement                                                                                                   | Status   | Owner       | Evidence                                     | Deadline              | Guidebook page |
| ----- | ------------------------------------------------------------------------------------------------------------- | -------- | ----------- | -------------------------------------------- | --------------------- | -------------- |
| [ ]   | Every participant is an active Indonesian Diploma or undergraduate student with valid student identification. | Pending  | Team lead   | Valid student cards and registration records | Registration          | 7              |
| [x]   | Team size is two to three people. This project uses three people.                                             | Complete | Team lead   | `docs/team-workflow.md`                      | Registration          | 7              |
| [ ]   | The team submits no more than one website.                                                                    | Pending  | Team lead   | Submission record                            | Sep 6, 2026 23:59 WIB | 7              |
| [x]   | The website implements at least one listed subtheme or SDG. SDG 8 is primary and SDG 9 is secondary.          | Complete | Discover    | README and architecture                      | Submission            | 5, 7, 14       |
| [ ]   | The work is original, not commercially published, and not a previous winner of a similar competition.         | Pending  | All         | Signed team review and repository history    | Submission            | 7              |
| [x]   | No instant website template such as WordPress or Wix is used.                                                 | Complete | Integration | Next.js source and initial commit            | Submission            | 7              |
| [x]   | Every library and framework has a documented purpose.                                                         | Complete | Integration | README technology table                      | Submission            | 7, 9           |
| [ ]   | AI use is ethical and includes privacy, security, copyright controls, and human review.                       | Pending  | All         | `docs/ai-usage.md` and PR evidence           | Every change          | 8              |
| [ ]   | Every participant reads, understands, and agrees to the guidebook.                                            | Pending  | Team lead   | Team confirmation                            | Before registration   | 8              |
| [ ]   | Registered participant identities remain unchanged during the competition.                                    | Pending  | Team lead   | Registration record                          | Competition period    | 8              |
| [ ]   | The final work contains no plagiarism or copyright infringement.                                              | Pending  | All         | Attribution audit and originality review     | Submission            | 17             |

## Registration

| Check | Requirement                                                                                    | Status  | Owner       | Evidence                      | Deadline            | Guidebook page |
| ----- | ---------------------------------------------------------------------------------------------- | ------- | ----------- | ----------------------------- | ------------------- | -------------- |
| [ ]   | Create an account at the official ITechnoCup website.                                          | Pending | Team lead   | Verified account              | Registration period | 18             |
| [ ]   | Complete all participant identity data in the account dashboard.                               | Pending | Each member | Completed dashboard           | Registration period | 18             |
| [ ]   | Select the Web Development competition category.                                               | Pending | Team lead   | Category record               | Registration period | 18             |
| [ ]   | Enter the team name and invite or add all registered members.                                  | Pending | Team lead   | Team roster                   | Registration period | 18             |
| [ ]   | Pay Rp85.000 during early bird or Rp95.000 during normal registration.                         | Pending | Team lead   | Payment receipt               | Registration period | 18, 21         |
| [ ]   | Upload payment proof using the official form.                                                  | Pending | Team lead   | Dashboard upload confirmation | Registration period | 18             |
| [ ]   | Obtain organizer verification with complete participant, team, payment, and member-count data. | Pending | Team lead   | Dashboard status `Verified`   | Registration period | 18             |

## Checklist submission

| Check | Requirement                                                                               | Status   | Owner       | Evidence                            | Deadline              | Guidebook page |
| ----- | ----------------------------------------------------------------------------------------- | -------- | ----------- | ----------------------------------- | --------------------- | -------------- |
| [ ]   | Submit through the ITechnoCup website.                                                    | Pending  | Team lead   | Submission confirmation             | Sep 6, 2026 23:59 WIB | 12             |
| [ ]   | Submit by Sunday, September 6, 2026 at 23:59 WIB.                                         | Pending  | Team lead   | Timestamped confirmation            | Sep 6, 2026 23:59 WIB | 12             |
| [ ]   | Provide a GitHub repository link containing the application source.                       | Pending  | Integration | Private organization repository URL | Submission            | 9, 12          |
| [ ]   | Provide an accessible hosted website link.                                                | Pending  | Act         | Production URL and uptime check     | Submission            | 9, 12          |
| [ ]   | Keep the hosted website accessible after submission.                                      | Pending  | Act         | Post-submission monitoring evidence | Through judging       | 10             |
| [x]   | Include README documentation in the repository.                                           | Complete | Integration | `README.md`                         | Submission            | 9, 12          |
| [x]   | README explains the application background and objective.                                 | Complete | Discover    | `README.md` introduction            | Submission            | 9              |
| [x]   | README explains the purpose of technologies, libraries, and frameworks.                   | Complete | Integration | `README.md` technology table        | Submission            | 9              |
| [x]   | README explains distinguishing main features.                                             | Complete | Discover    | `README.md` feature section         | Submission            | 9              |
| [x]   | README provides installation instructions.                                                | Complete | Integration | `README.md` local setup             | Submission            | 9              |
| [x]   | README provides usage and run instructions.                                               | Complete | Integration | `README.md` scaffold usage          | Submission            | 9              |
| [ ]   | Documentation is clear and includes screenshots where they improve understanding.         | Pending  | Discover    | Documentation and screenshot files  | Submission            | 10             |
| [ ]   | README is checked against the organizer-provided README template linked in the guidebook. | Pending  | Team lead   | Final documentation review          | Submission            | 12             |

## Final round

| Check | Requirement                                                                                                                   | Status                 | Owner     | Evidence                           | Deadline               | Guidebook page |
| ----- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------- | --------- | ---------------------------------- | ---------------------- | -------------- |
| [ ]   | If selected among ten finalists, attend the online final meeting.                                                             | Pending                | All       | Attendance and meeting link        | Organizer schedule     | 10, 13         |
| [ ]   | Present the product, features, technology, and a live demonstration.                                                          | Pending                | All       | Slide deck and rehearsal recording | Final                  | 10, 13         |
| [ ]   | Explain the background, problem, solution, objectives, and features.                                                          | Pending                | Discover  | Slide deck                         | One day before final   | 10, 11         |
| [ ]   | Send the presentation file no later than one day before the final.                                                            | Pending                | Team lead | Organizer delivery confirmation    | One day before final   | 10             |
| [ ]   | Report technical problems to organizers immediately.                                                                          | Pending                | Team lead | Incident communication record      | Before or during final | 11             |
| [ ]   | Keep the presentation within 10 minutes.                                                                                      | Pending                | Presenter | Timed rehearsal                    | Final                  | 11             |
| [ ]   | Answer the collected judge questions within the following 10 minutes.                                                         | Pending                | All       | Q&A rehearsal                      | Final                  | 11             |
| [ ]   | Respond when called within five minutes or move to the final presentation slot.                                               | Pending                | All       | Attendance runbook                 | Final                  | 11             |
| [ ]   | Respond within ten minutes when called in the final slot to avoid disqualification.                                           | Pending                | All       | Attendance runbook                 | Final                  | 11             |
| [ ]   | Confirm the official final and closing dates with organizers because the guidebook lists September 20 and September 28, 2026. | Organizer confirmation | Team lead | Written organizer response         | Before slide delivery  | 11, 13         |

## Preliminary judging

| Check | Requirement                                                                                              | Status  | Owner       | Evidence                            | Deadline   | Guidebook page |
| ----- | -------------------------------------------------------------------------------------------------------- | ------- | ----------- | ----------------------------------- | ---------- | -------------- |
| [ ]   | Theme, subtheme, and SDG relevance is optimized for the 20% criterion.                                   | Pending | Discover    | Product narrative and SDG mapping   | Submission | 14             |
| [ ]   | Innovation, originality, creativity, and differentiation are optimized for 20%.                          | Pending | Discover    | Competitive rationale               | Submission | 14             |
| [ ]   | Functionality, performance, stability, and main features are optimized for 20%.                          | Pending | Act         | Automated tests and demo evidence   | Submission | 14             |
| [ ]   | UI/UX, navigation, consistency, and responsiveness are optimized for 15%.                                | Pending | Discover    | Accessibility and responsive review | Submission | 15             |
| [ ]   | Technology, code structure, efficiency, modern implementation, and basic security are optimized for 15%. | Pending | Integration | Architecture and security evidence  | Submission | 15             |
| [ ]   | Repository quality, documentation, structure, installation, and usage are optimized for 10%.             | Pending | Integration | Clean clone rehearsal               | Submission | 15             |

## Final judging

| Check | Requirement                                                                                            | Status  | Owner       | Evidence                                    | Deadline          | Guidebook page |
| ----- | ------------------------------------------------------------------------------------------------------ | ------- | ----------- | ------------------------------------------- | ----------------- | -------------- |
| [ ]   | Presentation, problem framing, impact, and command of the product are optimized for 25%.               | Pending | All         | Timed pitch rehearsal                       | Final             | 16             |
| [ ]   | Live demo, stability, and real feature functionality are optimized for 25%.                            | Pending | Act         | Demo checklist and fallback plan            | Final             | 16             |
| [ ]   | Innovation, impact, sustainability, and SDG relevance are optimized for 20%.                           | Pending | Discover    | Impact evidence and SDG mapping             | Final             | 16             |
| [ ]   | Architecture, security, scalability, efficiency, and technical understanding are optimized for 20%.    | Pending | Integration | Architecture review and technical rehearsal | Final             | 17             |
| [ ]   | Technical and business Q&A is optimized for 10%.                                                       | Pending | All         | Question bank and answers                   | Final             | 17             |
| [ ]   | The team accepts that judging is objective against the listed indicators and jury decisions are final. | Pending | All         | Team confirmation                           | Before submission | 17             |

## Release gate

Before submission, replace each pending item with concrete evidence, verify every external link in a clean browser session, and record the final commit SHA, deployment identifier, and submission timestamp here.
