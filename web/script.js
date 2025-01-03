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
      sceneHeader.textContent = `${scene.number || `Scene ${sceneIndex + 1}`}: ${scene.name || "Untitled Scene"}`;
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

    // Add Button Dropdown
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
        scenes[sceneIndex].elements.push({ type: "speech", name: "", description: "", dialog: "" });
        renderDocument();
      };

      const addActionButton = document.createElement("button");
      addActionButton.textContent = "Add Action";
      addActionButton.onclick = () => {
        scenes[sceneIndex].elements.push({ type: "action", description: "" });
        renderDocument();
      };

      dropdownContent.appendChild(addSpeechButton);
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
    .map(
      (scene) =>
        `# ${scene.number || `Scene ${scene.index + 1}`}: ${scene.name || "Untitled Scene"}\n${
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

// Initial Render
renderDocument();