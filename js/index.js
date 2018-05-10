// References to all the element we will need.
var video = document.querySelector('#camera-stream'),
  image = document.querySelector('#snap'),
  start_camera = document.querySelector('#start-camera'),
  wordy_words = document.querySelector('.content-holder'),
  controls = document.querySelector('.controls'),
  take_photo_btn = document.querySelector('#take-photo'),
  delete_photo_btn = document.querySelector('#delete-photo'),
  download_photo_btn = document.querySelector('#download-photo'),
  error_message = document.querySelector('#error-message');
user_si_id = '';
const reload = document.querySelector('#reload');
reload.addEventListener('click', () => {
  location.reload()
})

var cardTwo = $(".card-2")
var spinner = $('#spinner');

spinner.hide()
cardTwo.hide()
$(".camera").click(function () {
  $('.card').hide()
})

// RUN camera
// const camera = $('#take-photo')
// camera.hide()
// const cameraIcon = $('#run-camera');
// cameraIcon.addEventListener('click', function () {
//   const camera = $('#take-photo');
//   camera.show('slide', 500)
// })
// The getUserMedia interface is used for handling camera input. Some browsers
// need a prefix so here we're covering all the options
navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

if (!navigator.getMedia) {
  displayErrorMessage("Your browser doesn't have support for the navigator.getUserMedia interface.");
} else {

  // Request the camera.
  navigator
    .getMedia({
        video: true
      },
      // Success Callback
      function (stream) {

        // Create an object URL for the video stream and set it as src of our HTLM video
        // element.
        video.src = window
          .URL
          .createObjectURL(stream);

        // Play the video element to start the stream.
        video.play();
        video.onplay = function () {
          showVideo();
        };

        // $('#status').html('Open webcam feed');

      },
      // Error Callback
      function (err) {
        displayErrorMessage("There was an error with accessing the camera stream: " + err.name, err);
      });

}

// Mobile browsers cannot play video without user input, so here we're using a
// button to start it manually.
start_camera
  .addEventListener("click", function (e) {

    e.preventDefault();

    // Start video playback manually.
    video.play();
    showVideo();

    $('#status').html('Press camera to start identification...');

  });

take_photo_btn.addEventListener("click", function (e) {

  e.preventDefault();

  var snap = takeSnapshot();
  var myBlob = makeblob(snap);

  $('#kudos').html('');
  $('#kudos-header').css('display', 'none');
  $('#status').html('Please Wait....')


  server_endpoint = 'https://westus2.api.cognitive.microsoft.com/face/v1.0';
  api_key = '2d135cb4d63a4f069a05e19832a043c6';
  person_group_id = 'fresh-team';

  $.ajax({
      url: server_endpoint + '/detect?returnFaceId=true&returnFaceLandmarks=false',
      beforeSend: function (request) {
        request.setRequestHeader('Ocp-Apim-Subscription-Key', api_key);
        request.setRequestHeader('Content-Type', 'application/octet-stream');
      },
      type: 'POST',
      processData: false,
      contentType: 'application/octet-stream',
      data: myBlob
    })
    .done(function (data) {
      if (data.length == 0) {
        $('#status').html('No face recognized. Try again.');
      } else {
        $('#status').html("Recognition Success!");
        spinner.show()
      }

      console.log(data);
      console.log("Face ID: " + data[0].faceId);

      $('#status').html('Identifying photo for team member...');

      verifyDetails = {
        "personGroupId": person_group_id,
        "faceIds": [data[0].faceId],
        "maxNumOfCandidatesReturned": 1,
        "confidenceThreshold": 0.5
      };

      $.ajax({
          url: server_endpoint + '/identify',
          beforeSend: function (request) {
            request.setRequestHeader('Ocp-Apim-Subscription-Key', api_key);
            request.setRequestHeader('Content-Type', 'application/json');
          },
          type: 'POST',
          processData: false,
          contentType: 'application/json',
          data: JSON.stringify(verifyDetails)
        })
        .done(function (data) {
          console.log(data);

          if (data[0].candidates.length == 0) {
            $('#status').html('Unable to identify team member. Please try again.');
          }

          $.ajax({
              url: server_endpoint + '/persongroups/' + person_group_id + '/persons/' + data[0].candidates[0].personId,
              beforeSend: function (request) {
                request.setRequestHeader('Ocp-Apim-Subscription-Key', api_key);
                request.setRequestHeader('Content-Type', 'application/json');
              },
              type: 'GET',
              contentType: 'application/json'
            })
            .done(function (data) {
              $('#status').html("<h5>" + data.name + "</h5>");
              // $('#status').html("Fresh Team Member: <br><h5>" + data.name + "</h5>");
              console.log(data);

              user_si_id = data.userData;
              console.log('User SI ID: ' + user_si_id);

              var allDone = false;
              console.log('Raw Data: ' + siData);
              for (i = 0; i < siData.length; i++) {
                if (allDone) {
                  break;
                }
                console.log('Recipients: ' + siData[i].recipients);
                var recipients = siData[i].recipients;
                for (j = 0; j < recipients.length; j++) {
                  console.log('Single recipient ID: ' + recipients[j].id);
                  $('#scanner').hide()

                  slideCamera()


                  if (allDone) {
                    break;
                  }
                  if (recipients[j].id == user_si_id) {
                    console.log('Match!');
                    $('#kudos-header').css('display', 'block');
                    $('#kudos').html(siData[i].message);
                    $("#author").html(siData[i].author.name)
                    $("#author-pic").attr('src', siData[i].author.logo)
                    slideCamera()
                    allDone = true;

                  }
                }

              }
            })
            .fail(function (data) {
              $('#status').html("Unable to retrieve team member. Please try again.");
              console.log(data);
            });
        })
        .fail(function (data) {
          $('#status').html("Unable to identify team member. Please try again..");
          console.log(data);
        });

    })
    .fail(function (data) {
      $('#status').html("Unable to track face from photo. Please try again.");
      console.log(data);
    });

  function slideCamera() {
    $(".sidebar").velocity({
      width: "20%"
    }, {
      duration: 800
    })

    // $(".card-2").velocity({   width: '80%',   display: 'block' }, {duration:
    // 800})

    cardTwo.show("slide", 1000)


    // .animate({translateX: '-1000%',width: "95%"})
  }
  // Show image.
  image.setAttribute('src', snap);
  image
    .classList
    .add("visible");

  // Enable delete and save buttons
  delete_photo_btn
    .classList
    .remove("disabled");
  // download_photo_btn   .classList   .remove("disabled"); Set the href attribute
  // of the download button to the snap url. download_photo_btn.href = snap;
  // Pause video playback of stream.
  video.pause();

});

delete_photo_btn.addEventListener("click", function (e) {

  e.preventDefault();

  // Hide image.
  image.setAttribute('src', "");
  image
    .classList
    .remove("visible");

  // Disable delete and save buttons
  delete_photo_btn
    .classList
    .add("disabled");
  download_photo_btn
    .classList
    .add("disabled");

  // Resume playback of stream.
  video.play();

  // Reset display
  $('#kudos').html('');
  $('#kudos-header').css('display', 'none');
  $('#status').html('Press camera icon to start identification...');

});

makeblob = function (dataURL) {
  var BASE64_MARKER = ';base64,';
  if (dataURL.indexOf(BASE64_MARKER) == -1) {
    var parts = dataURL.split(',');
    var contentType = parts[0].split(':')[1];
    var raw = decodeURIComponent(parts[1]);
    return new Blob([raw], {
      type: contentType
    });
  }
  var parts = dataURL.split(BASE64_MARKER);
  var contentType = parts[0].split(':')[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;

  var uInt8Array = new Uint8Array(rawLength);

  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], {
    type: contentType
  });
}

function showVideo() {
  // Display the video stream and the controls.

  hideUI();
  video
    .classList
    .add("visible");
  controls
    .classList
    .add("visible");
}

function takeSnapshot() {
  // Here we're using a trick that involves a hidden canvas element.

  var hidden_canvas = document.querySelector('canvas'),
    context = hidden_canvas.getContext('2d');

  var width = video.videoWidth,
    height = video.videoHeight;

  if (width && height) {

    // Setup a canvas with the same dimensions as the video.
    hidden_canvas.width = width;
    hidden_canvas.height = height;

    // Make a copy of the current frame in the video on the canvas.
    context.drawImage(video, 0, 0, width, height);

    // Turn the canvas image into a dataURL that can be used as a src for our photo.
    return hidden_canvas.toDataURL('image/png');
  }
}

function displayErrorMessage(error_msg, error) {
  error = error || "";
  if (error) {
    console.log(error);
  }

  error_message.innerText = error_msg;

  hideUI();
  error_message
    .classList
    .add("visible");
}

function hideUI() {
  // Helper function for clearing the app UI.

  controls
    .classList
    .remove("visible");
  start_camera
    .classList
    .remove("visible");
  start_camera
    .classList
    .add("hide");
  wordy_words
    .classList
    .add("visible");
  wordy_words
    .classList
    .remove("hide");
  video
    .classList
    .remove("visible");
  snap
    .classList
    .remove("visible");
  error_message
    .classList
    .remove("visible");
}

$("body")
  .keypress(function (e) {
    if (e.key === ' ' || e.key === 'Spacebar') {
      document
        .querySelector('#take-photo')
        .click();
    }
  });