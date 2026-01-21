import cookie from "cookie";


export function setRefreshCookie( res, token ) {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("refresh_token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })
  )
}

export function clearRefreshCookie( res ){
  res.setHeader(
    "Set-Cookie",
      cookie.serialize("refresh_token", "", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
      maxAge: 0,
      }),
  );

}