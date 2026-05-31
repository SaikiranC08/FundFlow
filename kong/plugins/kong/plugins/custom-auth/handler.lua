local kong = kong
local http = require "resty.http"

local CustomAuthHandler = {
  PRIORITY = 1000,
  VERSION = "1.0",
}

function CustomAuthHandler:access(config)

    kong.log.err(
      "REQUEST METHOD: ",
      kong.request.get_method()
    )

  -- Skip authentication for CORS preflight requests
  if kong.request.get_method() == "OPTIONS" then
    return
  end

  -- Get auth service URL from config
  local auth_service_url = config.auth_service_url

  -- Get Authorization header from incoming request
  local authorization_header =
    kong.request.get_header("Authorization")

  -- If token missing
  if not authorization_header then
    return kong.response.exit(401, {
      message = "Missing Authorization Header"
    })
  end

  -- Create HTTP client
  local httpc = http.new()

  httpc:set_timeouts(
    10000,
    10000,
    10000
  )

  -- Call auth service
  local res, err = httpc:request_uri(
    auth_service_url,
    {
      method = "GET",

      headers = {
        ["Authorization"] = authorization_header
      }
    }
  )

  -- If auth service unavailable
  if not res then

    kong.log.err(
      "Failed to call auth service: ",
      err
    )

    return kong.response.exit(500, {
      message = "Internal Server Error"
    })
  end

  -- If token invalid
  if res.status ~= 200 then

    return kong.response.exit(
      res.status,
      {
        message = "Unauthorized"
      }
    )
  end

  -- Get user ID from auth service response
  local user_id = res.body

  -- Forward user ID to downstream service
  kong.service.request.set_header(
    "x-user-id",
    user_id
  )
end

return CustomAuthHandler