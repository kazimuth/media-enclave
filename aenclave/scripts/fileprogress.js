/*
  A simple class for displaying file information and progress
  Note: This is a demonstration only and not part of SWFUpload.
  Note: Some have had problems adapting this class in IE7. It may not be suitable for your application.
  TODO(rnk): jquery-ify this code and clean it up so it is less brittle and
  easier to read.
*/

// Constructor
// file is a SWFUpload file object
// targetID is the HTML element id attribute that the FileProgress HTML structure will be added to.
// Instantiating a new FileProgress object with an existing file will reuse/update the existing DOM elements
function FileProgress(file, targetID) {
  this.fileProgressID = file.id;

  this.opacity = 100;
  this.height = 0;

  this.progressRow = document.getElementById(this.fileProgressID);
  if (!this.progressRow) {
    this.progressRow = document.createElement("tr");
    this.progressRow.className = "progressWrapper";
    this.progressRow.id = this.fileProgressID;

    var numColumns = $('#songlist thead th').size();

    this.progressCell = document.createElement("td");
    this.progressCell.className = "progressContainer";
    this.progressCell.setAttribute('colspan', numColumns);

    var $progressCancel = $('<a class="progressCancel" href="#">Cancel</a>');
    $progressCancel.css('visibility', 'hidden');

    var $progressText = $('<span class="progressName"></span>');
    $progressText.text(file.name);  // This will sanitize the name.

    var $progressBar = $('<span class="progressBarInProgress"></span>');

    var $progressStatus = $('<span class="progressBarStatus">&nbsp;</span>');

    this.progressCell.appendChild($progressCancel.get(0));
    this.progressCell.appendChild($progressText.get(0));
    this.progressCell.appendChild($progressStatus.get(0));
    this.progressCell.appendChild($progressBar.get(0));

    this.progressRow.appendChild(this.progressCell);

    var tbody = jQuery('#songlist tbody').get(0);
    tbody.appendChild(this.progressRow);
  } else {
    this.progressCell = this.progressRow.firstChild;
  }

  this.height = this.progressRow.offsetHeight;

}

FileProgress.prototype.setProgress = function (percentage) {
  this.progressCell.className = "progressContainer green";
  this.progressCell.childNodes[2].className = "progressBarInProgress";
  this.progressCell.childNodes[2].style.width = percentage + "%";
};

FileProgress.prototype.setComplete = function () {
  this.progressCell.className = "progressContainer blue";
  this.progressCell.childNodes[2].className = "progressBarComplete";
  this.progressCell.childNodes[2].style.width = "";

  var oSelf = this;
  oSelf.disappear();
};

FileProgress.prototype.setError = function () {
  this.progressCell.className = "progressContainer red";
  this.progressCell.childNodes[2].className = "progressBarError";
  this.progressCell.childNodes[2].style.width = "";

  var oSelf = this;
  setTimeout(function () {
    oSelf.disappear();
  }, 5000);
};

FileProgress.prototype.setCancelled = function () {
  this.progressCell.className = "progressContainer";
  this.progressCell.childNodes[2].className = "progressBarError";
  this.progressCell.childNodes[2].style.width = "";

  var oSelf = this;
  setTimeout(function () {
    oSelf.disappear();
  }, 2000);
};

FileProgress.prototype.setStatus = function (status) {
  this.progressCell.childNodes[2].innerHTML = status;
};

// Show/Hide the cancel button
FileProgress.prototype.toggleCancel = function (show, swfUploadInstance) {
  this.progressCell.childNodes[0].style.visibility = show ? "visible" : "hidden";
  if (swfUploadInstance) {
    var fileID = this.fileProgressID;
    this.progressCell.childNodes[0].onclick = function () {
      swfUploadInstance.cancelUpload(fileID);
      return false;
    };
  }
};

// Fades out and clips away the FileProgress box.
FileProgress.prototype.disappear = function () {

  var reduceOpacityBy = 15;
  var reduceHeightBy = 4;
  var rate = 30;    // 15 fps

  if (this.opacity > 0) {
    this.opacity -= reduceOpacityBy;
    if (this.opacity < 0) {
      this.opacity = 0;
    }

    if (this.progressRow.filters) {
      try {
        this.progressRow.filters.item("DXImageTransform.Microsoft.Alpha").opacity = this.opacity;
      } catch (e) {
        // If it is not set initially, the browser will throw an error.  This
        // will set it if it is not set yet.
        this.progressRow.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=" + this.opacity + ")";
      }
    } else {
      this.progressRow.style.opacity = this.opacity / 100;
    }
  }

  if (this.height > 0) {
    this.height -= reduceHeightBy;
    if (this.height < 0) {
      this.height = 0;
    }

    this.progressRow.style.height = this.height + "px";
  }

  if (this.height > 0 || this.opacity > 0) {
    var oSelf = this;
    setTimeout(function () {
      oSelf.disappear();
    }, rate);
  } else {
    this.progressRow.style.display = "none";
  }
};
