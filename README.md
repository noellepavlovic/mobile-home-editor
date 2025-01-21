## Elementalist

Elementalist is a dynamic, component-based web application designed to be a mobile home page editor. It allows users to create, edit, preview, and manage various content elements like text blocks, carousels, and call-to-action (CTA) components. This functionality is achieved through a combination of React functional components, state management, and drag-and-drop interactions. The overall approach focuses on modularity, user interactivity, and real-time feedback through live previews.

## Table of contents

- [Technologies](#technologies)
- [Setup](#setup)
- [Information](#information)

## Technologies

Project is created with:

- React
- Vite
- Typescript

## Setup

#### 1. Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (version 16 or later)
- **Git**
-

#### 2. Clone the Repository

1.  Open a terminal or command prompt.
2.  Navigate to the directory where you want to clone the project.
3.  Clone the repository using the following command

```
$ git clone git@github.com:noellepavlovic/mobile-home-editor.git
```

#### 3. Navigate to the Project Directory

```
$ cd <project-folder-name>
```

#### 4. Install Dependencies

Install all the required dependencies using `npm` (or `yarn` if you prefer):

```
$ npm install
```

Or if you use yarn:

```
$ yarn
```

#### 5. Build the Application

Generate a production-ready build using Vite:

```
$ npm run build
```

For **yarn**, run:

```
$ yarn build
```

This command will create a `dist` directory containing the optimized production files.

#### 6. Preview the Production Build

Generate a production-ready build using Vite:

```
$ npm run preview
```

For **yarn**, run:

```
$ yarn preview
```

You will see output similar to this:

```

➜ Local: http://localhost:4173/
➜ Network: http://<your-ip>:4173/

```

#### 7. Open the Application

- Open your web browser and navigate to `http://localhost:4173/`.
- You should now see the application running in a production-like environment.

## Information

### Core Features and Components

#### 1. Drag-and-Drop Functionality:

- The application uses react-dnd to enable drag-and-drop functionality.
- Users can drag content elements (like text editors, carousels, or CTAs) from a side panel and drop them into the editor area.
- This functionality is encapsulated in the LeftPanel, RightPanel, and DraggableElement components.

#### 2. Dynamic Content Editing:

- Each content type (e.g., text editor, carousel, CTA) has its dedicated editor component (TextEditor, Carousel, CallToAction).
- Users can modify properties such as text, font size, colours, and background images.
- The changes are reflected in real-time through live previews.

#### 3. Real-Time Context Management:

- useMobileEditor Context:
  - Centralized state management is achieved using a custom MobileEditorContext (React Context).
  - This context keeps track of all content elements in the editor and allows for updates or deletions.
- Config changes are seamlessly applied and propagated throughout the application.

#### 4. Custom Validation and Utilities:

- URL Validation (validateURL):
  - Ensures that user-provided URLs are valid and prepends http:// to incomplete URLs.
  - Provides descriptive error handling for invalid inputs.
- Hex Code Validation:
  - Ensures that user-provided Hex Codes are valid.
  - Provides descriptive error handling for invalid inputs.
- Drag Prevention (preventDrag):
  - Prevents unintended drag behaviours on specific input elements.

#### 5. Interactive Modals:

- Modals are used for granular edits (e.g., font size, colour changes, link editing, background images) and confirmation dialogs (e.g., delete confirmation).
- They enhance user experience by isolating edits from the main interface.

#### 6. Reusable and Scalable Design:

- Each component is designed to be modular and reusable.
- Shared logic (e.g., handling configurations, url validation or preventing drag) is abstracted into utility functions to minimize redundancy.

#### 7. Accessibility and Responsiveness:

- Components include aria-labels for improved accessibility.
- The layout adapts to varying screen sizes, ensuring usability across devices.

### Approach:

#### 1. Component-Based Architecture:

- Each feature (e.g., drag-and-drop, content editing, previewing) is encapsulated in self-contained React components.
- Promotes separation of concerns, making the application easier to maintain and scale.
-

#### 2. Stateful and Context-Driven:

- The context API simplifies state management and ensures global access to the list of elements.
- Local component states handle specific interactions, such as editing fields or toggling modals.
-

#### 3. User-Centric Design:

- Emphasis on real-time interactivity, such as live previews of edits.
- Drag-and-drop interactions and intuitive modals create an engaging, user-friendly experience.

#### 4. Validation and Error Handling:

- Inputs are validated with clear error messages (e.g., invalid URLs or hex codes), reducing user frustration.
- Configurable fallback behaviours ensure that invalid inputs do not break the application.

#### 5. Styling and Presentation:

- Styling uses modern utility classes (e.g., Tailwind CSS).
- Consistent design across components ensures a cohesive user interface.

### Jest Testing Integration

This project includes Jest tests to validate critical functionality, ensuring robustness and reliability. These tests focus on both unit and integration levels:

#### 1. Component Tests:

- Each React component has dedicated tests to verify rendering, prop behaviour, and user interactions.
- Examples:
  - Testing TextEditor to confirm that title, description, and font size updates are applied correctly.
  - Verifying that the Carousel component updates its configuration when receiving new props.

#### 2. Utility Tests:

- Utilities like validateURL and preventDrag have standalone tests.
- validateURL Tests:
  - Ensure valid URLs pass validation and are normalized with the correct protocol.
  - Confirm that invalid URLs throw descriptive errors.
- preventDrag Tests:
  - Verify that drag events are prevented and do not propagate.

#### 3. Context Tests:

- Tests for the useMobileEditor context validate that elements are added, updated, and removed correctly.
- Simulated state changes ensure that the context functions behave as expected in different scenarios.

#### 4. Integration Tests:

- Test components like RightPanel to confirm that drag-and-drop functionality correctly interacts with the editor.
- Ensure live previews update accurately when configuration changes are made.
-

#### 5. Mocking:

- jest.fn() and other mocking utilities are used to simulate external dependencies and isolate tests.
- Example: Mocking the validateURL function to test how components handle URL validation errors.
