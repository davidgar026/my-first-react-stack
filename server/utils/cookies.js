import cookie from "cookie";


export function setRefreshCookie( res, token ) {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("refresh_token", token, {
      httpOnly: true, //prevents client-side scripts such as Javascript to access the cookie.
      sameSite: "strict", //controls whether the cookie would be sent over via cross-site requests. In this case, it's strict so the cookie will only be sent
        //if it's coming from the same site as the cookie itself.
      secure: process.env.NODE_ENV === "production", // communicates to the web browser to only send the cookie via a secure and encrypted (HTTPS) connection.
      path: "/", //cookie is valid only at this endpoint called the refresh endpoint
      maxAge: 60 * 60 * 24 * 7, //lifetime of the cookie. In this case its 7d
    })
  )
}

export function clearRefreshCookie( res ){
  res.setHeader(
    "Set-Cookie",
      cookie.serialize("refresh_token", "", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/", // also clear the legacy one
      maxAge: 0,
      }),
  );

}