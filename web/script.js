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
      sceneHeader.textContent = `${scene.number || `Scene ${sceneIndex + 1}`}: ${
        scene.name || "Untitled Scene"
      }`;
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

    // Add new elements (speech/action)
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

// ---- NEW: Minimal ODT Export ----
function exportODT() {
  /*
    1) We define "automatic-styles" in content.xml, with real ODT elements for headings,
       bold, and italic text.
    2) Then we build the body (<office:text>) by mapping your scenes & elements
       into <text:h>, <text:p>, and <text:span> blocks that reference those styles.
    3) JSZip is used to assemble it all into a valid .odt (ZIP) file.
  */

  // Helper to escape user text (angle brackets, ampersands, etc.).
  function xmlEscape(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // Build the ODT body: each scene => <text:h> for scene title, <text:p> for desc, etc.
  let bodyXML = "";

  scenes.forEach((scene, sceneIndex) => {
    // Scene heading
    const sceneNum = scene.number || `Scene ${sceneIndex + 1}`;
    const sceneName = scene.name || "Untitled Scene";
    const titleText = xmlEscape(`${sceneNum}: ${sceneName}`);

    bodyXML += `
      <text:h text:style-name="Heading1" text:outline-level="1">${titleText}</text:h>
    `;

    // Scene description (italic paragraph)
    if (scene.description) {
      const descText = xmlEscape(scene.description);
      bodyXML += `
        <text:p text:style-name="ItalicParagraph">${descText}</text:p>
      `;
    }

    // Elements (speech/action)
    scene.elements.forEach((el) => {
      if (el.type === "speech") {
        const charName = xmlEscape(el.name || "Character");
        const charDesc = el.description ? xmlEscape(`(${el.description})`) : "";
        const dialog = xmlEscape(el.dialog || "");

        // Example structure:
        // <text:p>
        //   <text:span text:style-name="Bold">CHAR NAME</text:span>
        //   <text:span text:style-name="Italic">(desc)</text:span>
        //   "dialog goes here..."
        // </text:p>
        bodyXML += `
          <text:p>
            <text:span text:style-name="Bold">${charName}</text:span>
            ${charDesc ? ` <text:span text:style-name="Italic">${charDesc}</text:span>` : ""}
            <text:span> "${dialog}"</text:span>
          </text:p>
        `;
      } else if (el.type === "action") {
        // E.g. <text:p text:style-name="ItalicParagraph">Action description</text:p>
        const actionDesc = xmlEscape(el.description || "");
        bodyXML += `
          <text:p text:style-name="ItalicParagraph">${actionDesc}</text:p>
        `;
      }
    });
  });

  // A divider line between scenes, if you like (optional).
  // Or you can insert <text:p>-----</text:p> after each scene, etc.

  /*
    Now we wrap this <office:text> body along with <office:automatic-styles>
    into a minimal content.xml. We'll define styles for:
     - Heading1 (for scene headings)
     - Bold (for character names)
     - Italic (for short spans)
     - ItalicParagraph (for entire paragraphs in italics)

    You can further customize (font-size, alignment, etc.).
  */

  const contentXml = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-content
  xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
  xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0"
  xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
  xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0"
  office:version="1.2"
>
  <office:automatic-styles>
    <!-- Heading1 style -->
    <style:style style:name="Heading1" style:display-name="Heading 1" style:family="paragraph">
      <style:paragraph-properties fo:margin-bottom="0.1in"/>
      <style:text-properties fo:font-size="16pt" fo:font-weight="bold"/>
    </style:style>

    <!-- Bold inline style -->
    <style:style style:name="Bold" style:family="text">
      <style:text-properties fo:font-weight="bold"/>
    </style:style>

    <!-- Italic inline style -->
    <style:style style:name="Italic" style:family="text">
      <style:text-properties fo:font-style="italic"/>
    </style:style>

    <!-- Italic paragraph style -->
    <style:style style:name="ItalicParagraph" style:display-name="Italic Paragraph" style:family="paragraph">
      <style:text-properties fo:font-style="italic"/>
    </style:style>
  </office:automatic-styles>

  <office:body>
    <office:text>
      ${bodyXML}
    </office:text>
  </office:body>
</office:document-content>`;

  // The "mimetype" file must be stored uncompressed at the start of the ZIP
  const mimetype = "application/vnd.oasis.opendocument.text";

  // Use JSZip to create the ODT file
  const zip = new JSZip();

  // 1) Add the mimetype file (no compression)
  zip.file("mimetype", mimetype, { compression: "STORE" });

  // 2) Add content.xml
  zip.file("content.xml", contentXml);

  // 3) Minimal META-INF/manifest.xml is still helpful for many ODT editors
  const manifestXml = `<?xml version="1.0" encoding="UTF-8"?>
<manifest:manifest
  xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0"
  manifest:version="1.2">
  <manifest:file-entry
    manifest:full-path="/"
    manifest:version="1.2"
    manifest:media-type="application/vnd.oasis.opendocument.text"/>
  <manifest:file-entry
    manifest:full-path="content.xml"
    manifest:media-type="text/xml"/>
</manifest:manifest>`;

  zip.folder("META-INF").file("manifest.xml", manifestXml);

  // Generate the ZIP => ODT
  zip
    .generateAsync({ type: "blob" })
    .then((content) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "script.odt";
      link.click();
    })
    .catch((err) => {
      console.error("Error generating ODT:", err);
    });
}

// Hook up the Export ODT button
document.getElementById("export-odt").onclick = exportODT;

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
          const sceneNumber = commands[index + 1]?.trim();
          const sceneName = commands[index + 2]?.trim();
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
          break;

        case "AD": // Add Dialog
          const dialogSceneNumber = commands[index + 1]?.trim();
          const dialogName = commands[index + 2]?.trim();
          const dialogDescription = commands[index + 3]?.trim();
          const dialogText = commands[index + 4]?.trim();
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
          break;

        case "AC": // Add Action
          const actionSceneNumber = commands[index + 1]?.trim();
          const actionDescription = commands[index + 2]?.trim();
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
