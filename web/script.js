let scenes = [];
let previewMode = false;

function renderDocument() {
  const documentDiv = document.getElementById("document");
  documentDiv.innerHTML = "";

  scenes.forEach((scene, sceneIndex) => {
    const sceneDiv = document.createElement("div");
    sceneDiv.className = "scene";

    // Scene Header
    if (previewMode) {
      const sceneHeader = document.createElement("h3");
      // Use scene.number and scene.name or fallback
      const sceneNumberText = scene.number || `Scene ${sceneIndex + 1}`;
      const sceneNameText   = scene.name   || "Untitled Scene";
      sceneHeader.textContent = `${sceneNumberText}: ${sceneNameText}`;
      sceneDiv.appendChild(sceneHeader);

      if (scene.description) {
        const sceneDescription = document.createElement("p");
        sceneDescription.style.fontStyle = "italic";
        sceneDescription.textContent = scene.description;
        sceneDiv.appendChild(sceneDescription);
      }
    } else {
      const sceneHeader = document.createElement("h3");

      const sceneNumberInput = document.createElement("input");
      sceneNumberInput.type = "text";
      sceneNumberInput.placeholder = `Scene Number (e.g., Scene ${sceneIndex + 1})`;
      sceneNumberInput.value = scene.number || "";
      sceneNumberInput.oninput = (e) => {
        scenes[sceneIndex].number = e.target.value.trim();
      };
      sceneHeader.appendChild(sceneNumberInput);

      const sceneNameInput = document.createElement("input");
      sceneNameInput.type = "text";
      sceneNameInput.placeholder = "Scene Name";
      sceneNameInput.value = scene.name || "";
      sceneNameInput.oninput = (e) => {
        scenes[sceneIndex].name = e.target.value.trim();
      };
      sceneHeader.appendChild(sceneNameInput);

      const deleteSceneButton = document.createElement("button");
      deleteSceneButton.textContent = "Delete Scene";
      deleteSceneButton.onclick = () => {
        scenes.splice(sceneIndex, 1);
        renderDocument();
      };
      sceneHeader.appendChild(deleteSceneButton);

      sceneDiv.appendChild(sceneHeader);

      const sceneDescription = document.createElement("input");
      sceneDescription.type = "text";
      sceneDescription.placeholder = "Description/Setting (optional)";
      sceneDescription.value = scene.description || "";
      sceneDescription.oninput = (e) => {
        scenes[sceneIndex].description = e.target.value.trim();
      };
      sceneDiv.appendChild(sceneDescription);
    }

    // Scene Elements
    scene.elements.forEach((element, elementIndex) => {
      if (previewMode) {
        if (element.type === "speech") {
          const speechEl = document.createElement("p");
          speechEl.innerHTML = `<strong>${element.name}</strong> ${
            element.description ? `<i>(${element.description})</i>` : ""
          }<br>"${element.dialog}"`;
          sceneDiv.appendChild(speechEl);
        } else if (element.type === "action") {
          const actionEl = document.createElement("p");
          actionEl.innerHTML = `<i>${element.description}</i>`;
          sceneDiv.appendChild(actionEl);
        }
      } else {
        const elementDiv = document.createElement("div");

        if (element.type === "speech") {
          const nameInput = document.createElement("input");
          nameInput.type = "text";
          nameInput.placeholder = "Name";
          nameInput.value = element.name || "";
          nameInput.oninput = (e) => {
            element.name = e.target.value.trim();
          };
          elementDiv.appendChild(nameInput);

          const descriptionInput = document.createElement("input");
          descriptionInput.type = "text";
          descriptionInput.placeholder = "Description (optional)";
          descriptionInput.value = element.description || "";
          descriptionInput.oninput = (e) => {
            element.description = e.target.value.trim();
          };
          elementDiv.appendChild(descriptionInput);

          const dialogInput = document.createElement("input");
          dialogInput.type = "text";
          dialogInput.placeholder = "Dialog";
          dialogInput.value = element.dialog || "";
          dialogInput.oninput = (e) => {
            element.dialog = e.target.value.trim();
          };
          elementDiv.appendChild(dialogInput);
        } else if (element.type === "action") {
          const actionInput = document.createElement("input");
          actionInput.type = "text";
          actionInput.placeholder = "Action Description";
          actionInput.value = element.description || "";
          actionInput.oninput = (e) => {
            element.description = e.target.value.trim();
          };
          elementDiv.appendChild(actionInput);
        }

        const deleteElementButton = document.createElement("button");
        deleteElementButton.textContent = "Delete";
        deleteElementButton.onclick = () => {
          scenes[sceneIndex].elements.splice(elementIndex, 1);
          renderDocument();
        };
        elementDiv.appendChild(deleteElementButton);

        sceneDiv.appendChild(elementDiv);
      }
    });

    // Add new elements (speech/action) in Edit Mode
    if (!previewMode) {
      const dropdownDiv = document.createElement("div");
      dropdownDiv.className = "dropdown";
      const addButton = document.createElement("button");
      addButton.className = "add-icon";
      addButton.textContent = "+";
      addButton.onclick = () => {
        dropdownDiv.querySelector(".dropdown-content").classList.toggle("show");
      };
      dropdownDiv.appendChild(addButton);

      const dropdownContent = document.createElement("div");
      dropdownContent.className = "dropdown-content";

      const addSpeechButton = document.createElement("button");
      addSpeechButton.textContent = "Add Speech";
      addSpeechButton.onclick = () => {
        scenes[sceneIndex].elements.push({
          type: "speech",
          name: "",
          description: "",
          dialog: "",
        });
        renderDocument();
      };
      dropdownContent.appendChild(addSpeechButton);

      const addActionButton = document.createElement("button");
      addActionButton.textContent = "Add Action";
      addActionButton.onclick = () => {
        scenes[sceneIndex].elements.push({
          type: "action",
          description: "",
        });
        renderDocument();
      };
      dropdownContent.appendChild(addActionButton);

      dropdownDiv.appendChild(dropdownContent);
      sceneDiv.appendChild(dropdownDiv);
    }

    documentDiv.appendChild(sceneDiv);
  });
}

// Toggle Preview/Edit Mode
document.getElementById("toggle-preview").onclick = () => {
  previewMode = !previewMode;
  document.getElementById("toggle-preview").textContent = previewMode ? "Edit" : "Preview";
  renderDocument();
};

// Add Scene
document.getElementById("add-scene").onclick = () => {
  scenes.push({ number: "", name: "", description: "", elements: [] });
  renderDocument();
};

// Export JSON
document.getElementById("export-json").onclick = () => {
  const jsonBlob = new Blob([JSON.stringify(scenes, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(jsonBlob);
  link.download = "script.json";
  link.click();
};

// Import JSON
document.getElementById("import-json").onclick = () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "application/json";
  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        scenes = JSON.parse(event.target.result);
        renderDocument();
      };
      reader.readAsText(file);
    }
  };
  fileInput.click();
};

// Export Markdown
document.getElementById("export-markdown").onclick = () => {
  const markdown = scenes
    .map((scene, idx) =>
      `# ${scene.number || `Scene ${idx + 1}`}: ${scene.name || "Untitled Scene"}\n${
        scene.description ? `*${scene.description}*\n` : ""
      }` +
      scene.elements
        .map((el) =>
          el.type === "speech"
            ? `<br><br>**${el.name}**${el.description ? ` *(${el.description})*` : ""}\n<br>"${el.dialog}"`
            : `<br><br>*${el.description}*`
        )
        .join("\n")
    )
    .join("\n\n");

  const blob = new Blob([markdown], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "script.md";
  link.click();
};

// ---- DOCX Export with docx@9+ style ----
async function exportDOCX() {
  // Grab the needed constructors from docx
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = docx;

  // We'll build an array of Paragraphs for all scenes/elements
  const docParagraphs = [];

  scenes.forEach((scene, sceneIndex) => {
    const sceneNumber = scene.number || `Scene ${sceneIndex + 1}`;
    const sceneName = scene.name || "Untitled Scene";

    // Real Heading 1 for the scene
    docParagraphs.push(
      new Paragraph({
        text: `${sceneNumber}: ${sceneName}`,
        heading: HeadingLevel.HEADING_1,
      })
    );

    // Scene Description (if any), italic
    if (scene.description) {
      docParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `(${scene.description})`,
              italics: true,
            }),
          ],
        })
      );
    }

    // Scene Elements
    scene.elements.forEach((el) => {
      if (el.type === "speech") {
        const name   = el.name || "";
        const desc   = el.description ? `(${el.description})` : "";
        const dialog = el.dialog || "";

        // "Name (desc)" line
        if (name || desc) {
          const runs = [];
          if (name) {
            runs.push(new TextRun({ text: name, bold: true }));
          }
          if (desc) {
            runs.push(new TextRun({ text: ` ${desc}`, italics: true }));
          }
          docParagraphs.push(new Paragraph({ children: runs }));
        }

        // Dialog line
        if (dialog) {
          docParagraphs.push(new Paragraph(`"${dialog}"`));
        }
      } else if (el.type === "action") {
        const actionText = el.description || "";
        // Action in parentheses + italics
        docParagraphs.push(
          new Paragraph({
            children: [new TextRun({ text: `(${actionText})`, italics: true })],
          })
        );
      }
    });

    // Optionally add a blank paragraph after each scene
    docParagraphs.push(new Paragraph(""));
  });

  // Now, in docx@9+, we define sections in the Document constructor
  const doc = new Document({
    // We can specify metadata here if we want
    creator: "OpenScripty Web",
    title: "OpenScripty DOCX Export",
    description: "This document was made with OpenScripty Web, and was exported to DOCX.",

    // The 'sections' array replaces the old doc.addSection() calls
    sections: [
      {
        children: docParagraphs,
      },
    ],
  });

  try {
    // Generate the .docx as a Blob
    const blob = await Packer.toBlob(doc);
    // Download the file
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "script.docx";
    link.click();
  } catch (err) {
    console.error("Error generating DOCX:", err);
  }
}

document.getElementById("export-docx").onclick = exportDOCX;

// Import Edit Format
document.getElementById("import-edit-format").onclick = () => {
  const input = document.getElementById("edit-format-input").value;
  if (input) {
    const commands = input.split("¸");
    let index = 0;

    while (index < commands.length) {
      const command = commands[index].trim();
      if (!command) {
        index++;
        continue;
      }

      switch (command) {
        case "AS": // Add Scene
          {
            const sceneNumber      = commands[index + 1]?.trim();
            const sceneName        = commands[index + 2]?.trim();
            const sceneDescription = commands[index + 3]?.trim();
            if (sceneNumber && sceneName) {
              scenes.push({
                number: sceneNumber,
                name: sceneName,
                description: sceneDescription || "",
                elements: [],
              });
            }
            index += 4;
          }
          break;

        case "AD": // Add Dialog
          {
            const dialogSceneNumber  = commands[index + 1]?.trim();
            const dialogName         = commands[index + 2]?.trim();
            const dialogDescription  = commands[index + 3]?.trim();
            const dialogText         = commands[index + 4]?.trim();
            if (dialogSceneNumber && dialogName && dialogText) {
              const sceneIndex = scenes.findIndex(
                (scene) => scene.number === dialogSceneNumber
              );
              if (sceneIndex !== -1) {
                scenes[sceneIndex].elements.push({
                  type: "speech",
                  name: dialogName,
                  description: dialogDescription || "",
                  dialog: dialogText,
                });
              }
            }
            index += 5;
          }
          break;

        case "AC": // Add Action
          {
            const actionSceneNumber  = commands[index + 1]?.trim();
            const actionDescription  = commands[index + 2]?.trim();
            if (actionSceneNumber && actionDescription) {
              const sceneIndex = scenes.findIndex(
                (scene) => scene.number === actionSceneNumber
              );
              if (sceneIndex !== -1) {
                scenes[sceneIndex].elements.push({
                  type: "action",
                  description: actionDescription,
                });
              }
            }
            index += 3;
          }
          break;

        default:
          console.warn(`Unknown command: ${command}`);
          index++;
          break;
      }
    }

    renderDocument();
    document.getElementById("edit-format-input").value = "";
  }
};

// Initial Render
renderDocument();