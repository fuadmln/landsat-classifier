document.addEventListener(
  "DOMContentLoaded",
  function () {
    // fitur tab menu
    const tablinks = document.getElementsByClassName("tab-link");
    for (const tab of tablinks) {
      tab.addEventListener("click", (e) => {
        tabLinkContent(e);
      });
    }

    // Preview Gambar
    const imgSelector = document.getElementById("img-input");
    imgSelector.addEventListener("change", () => {
      const img = document.getElementById("img-preview");
      img.src = URL.createObjectURL(event.target.files[0]);
    });

    // Event Lakukan Prediksi
    const predictBtn = document.getElementById("predict");
    predictBtn.addEventListener("click", (e) => {
      e.preventDefault();
      doClassification();
      return;
    });

    // Event Lakukan Evaluasi
    const classifyBtn = document.getElementById("evaluate");
    classifyBtn.addEventListener("click", (e) => {
      e.preventDefault();
      doEvaluate();
      return;
    });
  },
  false
);

const tabLinkContent = (e) => {
  // hide active tab-link
  const tabList = document.getElementsByClassName("tab-link active");
  tabList[0].classList.remove("active");
  // show clicked tab
  e.target.classList.add("active");

  // hide displayed element
  const sectionList = document.getElementsByClassName("tab-content display");
  sectionList[0].classList.remove("display");
  // show clicked element
  const id = e.target.dataset.contentid;
  const section = document.getElementById(id);
  section.classList.add("display");
};

// Dummy API data
const predictionLabel = "Forest";
const accuracy = 90.0;
const confMatrixValue = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
];
const perfMetricValue = [
  [1, 2, 3],
  [1, 2, 3],
  [1, 2, 3],
  [1, 2, 3],
  [1, 2, 3],
  [1, 2, 3],
  [1, 2, 3],
  [1, 2, 3],
  [1, 2, 3],
  [1, 2, 3],
];

// HTML Hasil Prediksi
const predictionHTML = (label) => {
  return `
    <h2>Hasil Prediksi</h2>
    <p>Kelas: <span class="label">${label}<span></p>
  `;
};

// HTML Hasil Klasifikasi
const evaluateHTML = (accuracy, confMatrixValue, perfMetricValue) => {
  const labelName = [
    "ANC",
    "FRS",
    "HVG",
    "HGW",
    "IDS",
    "PST",
    "PMC",
    "RSD",
    "RVR",
    "SLK",
  ];
  const metricName = ["Precision", "Recall", "F1-Score"];

  // Confusion Matrix
  const confMatrixEl = (labelName, matrixValue) => {
    let confMatrixRowHead = (labelName) => `
      <tr>
        <th>Kelas</th>
        ${labelName
          .map((label) => {
            return "<th>" + label + "</th>";
          })
          .join("")}
      </tr>`;

    let rowDataEl = (singleRowData) => {
      return singleRowData.map((value) => `<td>${value}</td>`).join("");
    };

    let singleRowEl = (label, singleRowData) => {
      return `
        <tr>
          <th>${label}</th>
          ${rowDataEl(singleRowData)}
        </tr>`;
    };

    let rowListEl = (labelName, matrixValue) => {
      let rowEl = "";
      for (let i = 0; i < labelName.length; i++) {
        rowEl += singleRowEl(labelName[i], matrixValue[i]);
      }
      return rowEl;
    };

    return `
      <div id="conf-matrix">
        <table class="my-table">
          <caption>Confusion Matrix</caption>
          ${confMatrixRowHead(labelName)}
          ${rowListEl(labelName, matrixValue)}
        </table>
      </div>
      `;
  };

  // Performance Metrics
  const perfMatricEl = (labelName, metricName, perfMetricValue) => {
    let metricRowHead = (metricName) => {
      return `
        <tr>
          <th>Kelas</th>
          ${metricName
            .map((name) => {
              return "<th>" + name + "</th>";
            })
            .join("")}
        </tr>`;
    };

    let rowDataEl = (singleRowData) => {
      return singleRowData.map((value) => `<td>${value}</td>`).join("");
    };

    let singleRowEl = (name, singleRowData) => {
      return `
        <tr>
          <th>${name}</th>
          ${rowDataEl(singleRowData)}
        </tr>
      `;
    };

    let rowListEl = (labelName, perfMetricValue) => {
      let rowEl = "";
      for (let i = 0; i < labelName.length; i++) {
        rowEl += singleRowEl(labelName[i], perfMetricValue[i]);
      }
      return rowEl;
    };

    return `
      <div id="metrics">
        <table class="my-table">
          <caption>Performance Metrics</caption>
          ${metricRowHead(metricName)}
          ${rowListEl(labelName, perfMetricValue)}
        </table>
      </div>
    `;
  };

  return `
    <h2>Hasil Klasifikasi</h2>
    <p>Akurasi: <span class="acc">${accuracy}%<span></p>

    ${confMatrixEl(labelName, confMatrixValue)}
    ${perfMatricEl(labelName, metricName, perfMetricValue)}
  `;
};

const doClassification = () => {
  onOfButton("predict");
  const formData = new FormData($("#classification-form")[0]);
  // console.log(formData);

  $.ajax({
    url: "http://127.0.0.1:5000/classify",
    type: "POST",
    processData: false,
    contentType: false,
    cache: false,
    data: formData,
    success: (res) => {
      console.log(res);
      const label = res.data.class;
      const result = document.getElementById("classification-result");
      result.innerHTML = predictionHTML(label);
    },
    error: (res) => {
      console.log(res);
    },
    complete: () => {
      onOfButton("predict", "Klasifikasi");
    },
  });
};

const doEvaluate = () => {
  onOfButton("evaluate", "Hitung Akurasi");
  // get folder
  const dirChooser = document.getElementById("folder-input");
  const folder = dirChooser.files[0].webkitRelativePath.split("/")[0];

  $.ajax({
    url: "http://127.0.0.1:5000/evaluate",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      folder: folder,
    }),
    processData: false,
    crossDomain: true,
    success: (res) => {
      console.log(res);
      const data = res.data;
      const accuracy = (data.accuracy * 100).toFixed(2);
      const confMatrix = data.confusion_matrix;
      const perfMatric = data.metrics;

      const result = document.getElementById("evaluate-result");
      result.innerHTML = evaluateHTML(accuracy, confMatrix, perfMatric);
    },
    error: (res) => {
      console.log(res);
      alert("proses gagal");
    },
    complete: () => {
      onOfButton("evaluate", "Evaluasi");
    },
  });
};

const onOfButton = (btnId, text) => {
  const buttonElm = $("#" + btnId);
  const isDisabled = buttonElm.is(":disabled");
  if (isDisabled) {
    buttonElm.removeAttr("disabled");
    buttonElm.text(text);
  } else {
    buttonElm.attr("disabled", "disabled");
    buttonElm.text("Memproses...");
  }
};
