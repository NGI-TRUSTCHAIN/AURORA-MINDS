# AURORA-MINDS

## Overview
AURORA MINDS is an innovative digital health platform designed to improve early and accurate diagnosis of Attention Deficit Hyperactivity Disorder (ADHD) in children while prioritizing data privacy and security. The project, launched on January 15, 2024, leverages advanced privacy-preserving technologies such as Federated Learning and self-sovereign identity management to ensure that sensitive health data is protected. AURORA MINDS provides a secure, decentralized solution for ADHD assessment, which can be extended to other mental health conditions, and offers a flexible architecture for scaling across multiple sectors beyond healthcare.

The system allows parents to register their child with ADHD by completing a questionnaire on behavior, education, and medical history. After registration, parents gain access to the Behavior Application, which collects behavioral data from children's interactions with ADHD-specific applications. This data is securely transferred to the Machine Learning Backend Server for analysis, with insights provided to clinicians via the Behavioral Party. Clinicians access relevant information for diagnosis and treatment planning. The server stores processed data securely, and users can request Attribute-Based Credentials for access. Access control is managed by the Behavioral Party, with tailored access for children, parents, and clinicians. An Application Portal offers information and links to system components, while a Virtual Identity Provider enables credential management and verification tokens issuance. The overall architecture of our system is illustrated below:

![image](https://github.com/NGI-TRUSTCHAIN/AURORA-MINDS/blob/main/figures/AURORA%20MINDS%20(1).png)

## Project Structure

This repository integrates the three core components of the AURORA MINDS platform into a single cohesive project. The project is structured around the principles of microservices and each folder contains detailed instructions on how to set up the project.

- **Federated Learning Module**: This module enables decentralized data processing to maintain data privacy during machine learning model training. The FL server is available [here](https://github.com/NGI-TRUSTCHAIN/AURORA-MINDS/tree/main/FedAurora-FL%20Server)
- **Web App**: The web application supports clinician access, enabling them to review diagnostic data, manage reports, and engage with the assessment process. The web app also incorporates code for integrating other components. Available [here](https://github.com/NGI-TRUSTCHAIN/AURORA-MINDS/tree/main/AURORA-MINDS-Web-app).
- **Identity Management and Privacy-ABCs**: This component handles credential issuance, verification, and self-sovereign identity management using Privacy-Attribute-Based Credentials (Privacy-ABCs), ensuring that users have complete control over their digital identity. There are two services needed for the IdM, the [Service Provider](https://github.com/NGI-TRUSTCHAIN/AURORA-MINDS/tree/main/AuroraMinds-Service-Provider-IDM) and the main [IdM Module](https://github.com/NGI-TRUSTCHAIN/AURORA-MINDS/tree/main/AuroraMinds-IDM-Master)

## Key Features

### Privacy-Preserving Federated Learning
- **Decentralized Data Processing**: By keeping data local to user devices, federated learning minimizes the risk of data breaches, enhancing security and privacy.
- **Model Aggregation**: Combines user-contributed data updates without requiring direct access to raw data, supporting secure machine learning for sensitive health assessments.

### Self-Sovereign Identity and Access Control
- **DID and VC Integration**: Employs W3C-compliant Decentralized Identifiers (DIDs) and Verifiable Credentials (VCs), enabling self-sovereign identity management where users maintain control over their identity.
- **Privacy-ABCs**: Ensures that only authorized individuals (children, parents, clinicians) have access to sensitive data, and provides granular control over data sharing.

### Secure ADHD Assessment Tools
- **Interactive Game-Based Assessments**: The mobile app collects behavioral data through interactive games, facilitating ADHD risk assessment in a way that is engaging for children.
- **Clinician Dashboard**: The web app allows clinicians to access detailed insights, including behavioral reports and AI-based analysis, to support ADHD diagnosis.
- **Data Encryption and Compliance**: All data collected is encrypted and handled in compliance with GDPR, ensuring user privacy and regulatory adherence.

## Getting Started

To set up and run the AURORA MINDS platform, follow the steps below:

### Prerequisites
- **Node.js** for the Web App front end.
- **Python 3.8+** for the backend components.
- **Docker** for containerized deployments.
- **MongoDB** for data storage.
- **React** for the mobile and web applications.
  
### Installation
Clone this repository and then refer to the folder of each specific module to set up.
**Clone the Repository**:
   ```bash
   git clone https://github.com/NGI-TRUSTCHAIN/AURORA-MINDS.git
   cd AURORA-MINDS
```

### Integration with DIDROOM
AURORA MINDS integrates with [DidRoom](https://didroom.com/), a self-sovereign identity (SSI) wallet, to facilitate secure and decentralized identity management for the mobile app. This allows users to manage their digital identity independently, aligning with the European Digital Identity (eIDAS 2.0) framework.

### Future Directions
AURORA MINDS will continue to expand, with planned features including:
- **Additional Diagnostic Tools**: Support for assessing other mental health conditions, such as autism and learning disabilities.
- **IoT Data Integration**: Support for data from wearables (e.g., smartwatches) and external sensors (e.g., cameras) to enhance assessment accuracy.


<h1>Contact Information</h1>

If you have any questions, please feel free to reach out:

 Elizabeth Filippidis: elizabeth@dotsoft.gr

<hr> 

Aurora Minds Project has received funding from the Open Call #2 of TrustChain project: https://trustchain.ngi.eu/trustchain-open-call-2-results-funding-15-new-projects-to-build-the-next-generation-internet/ 
Special thanks to our partners and the open-source community for their support.
 
