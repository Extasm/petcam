(() => {
  const params = new URLSearchParams(location.search);
  const room = params.get("room");
  const isTablet = params.get("role") === "tablet";
  const status = document.querySelector("#status");
  if (!room || !/^[a-zA-Z0-9_-]{16,80}$/.test(room)) {
    document.querySelector("#loading h1").textContent = "Private room link required";
    status.textContent = "Open PetCam using your saved private link.";
    return;
  }
  if (!window.JitsiMeetExternalAPI) {
    status.textContent = "The call service could not load. Check the internet connection.";
    return;
  }
  const api = new JitsiMeetExternalAPI("meet.jit.si", {
    roomName: `PetCam-${room}`, parentNode: document.querySelector("#app"), width: "100%", height: "100%",
    configOverwrite: { prejoinPageEnabled: false, startWithAudioMuted: isTablet, startWithVideoMuted: isTablet, disableDeepLinking: true, enableWelcomePage: false },
    interfaceConfigOverwrite: { DEFAULT_BACKGROUND: "#080b0d", MOBILE_APP_PROMO: false, SHOW_JITSI_WATERMARK: false, SHOW_WATERMARK_FOR_GUESTS: false, TOOLBAR_BUTTONS: isTablet ? ["microphone", "camera", "hangup", "settings"] : ["microphone", "camera", "hangup", "settings", "tileview", "fullscreen"] },
    userInfo: { displayName: isTablet ? "Home · Cats" : "Nick" }
  });
  document.querySelector("#loading").hidden = true;
  let visitorCount = 0;
  let tabletLive = false;
  function setTabletLive(live) {
    if (!isTablet || tabletLive === live) return;
    tabletLive = live;
    api.executeCommand("toggleVideo");
    api.executeCommand("toggleAudio");
  }
  api.addEventListener("videoConferenceJoined", () => { status.textContent = isTablet ? "Waiting for your iPhone…" : "Connected."; });
  api.addEventListener("participantJoined", () => { visitorCount += 1; setTabletLive(true); });
  api.addEventListener("participantLeft", () => { visitorCount = Math.max(0, visitorCount - 1); if (visitorCount === 0) setTabletLive(false); });
})();
