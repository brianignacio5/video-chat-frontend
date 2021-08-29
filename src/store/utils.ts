export function errHandler(err: Error) {
  console.warn("Error", err);
  console.warn(err);
  if (err.name == "NotFoundError" || err.name == "DevicesNotFoundError") {
    //required track is missing
  } else if (err.name == "NotReadableError" || err.name == "TrackStartError") {
    //webcam or mic are already in use
  } else if (
    err.name == "OverconstrainedError" ||
    err.name == "ConstraintNotSatisfiedError"
  ) {
    //constraints can not be satisfied by avb. devices
  } else if (
    err.name == "NotAllowedError" ||
    err.name == "PermissionDeniedError"
  ) {
    //permission denied in browser
  } else if (err.name == "TypeError" || err.name == "TypeError") {
    //empty constraints object
  } else {
    //other errors
  }
}
