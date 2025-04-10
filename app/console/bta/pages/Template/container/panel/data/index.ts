import { HttpStatusCode } from "axios";
import { AssertionCondition, AssertionType, MapperType, MappingKey, ParameterPlacementKey } from "../../../../../types";

export const DATA = {
    NODE_DEFAULT_DATA: {
        name: "",
        metadata: {
            method: undefined,
            url: "",
            params: [],
            headers: [],
            authentication: "",
            body: ""
        }
    },
    POST_RESPONSE_ASSERTION_DEFAULT_DATA: {
        type: "" as AssertionType,
        key: "",
        condition: "" as AssertionCondition,
        value: "",
    },
    PRE_REQUEST_ASSERTION_DEFAULT_DATA: {
        type: "Global" as MapperType,
        currentKey: "",
        paramPosition: "" as ParameterPlacementKey,
        prevActionKey: "",
        prevParamPosition: "" as ParameterPlacementKey,
        prevNodeName: undefined,
        isDataMapping: false,
        mapping: {
            key: "" as MappingKey,
            value: "",
        }
    },
    PRE_REQUEST_ASSERTION_DEFAULT_ERROR: {
        currentKey: "",
        paramPosition: "",
        prevActionKey: "",
        prevParamPosition: "",
        prevNodeName: "",
        mapping: {
            key: "",
            value: "",
        }
    },
    PRE_REQUEST_ASSERTION_ERROR: {
        INVALID_URL: "Please enter a valid url containing the route parameter as key.",
        URL_NOT_FOUND: "URL not inserted. Please add a url before adding mapper assertions."
    },
    HTTP_STATUSES: [
        { code: HttpStatusCode.Continue, message: `Continue (${HttpStatusCode.Continue})` },
        { code: HttpStatusCode.SwitchingProtocols, message: `Switching Protocols (${HttpStatusCode.SwitchingProtocols})` },
        { code: HttpStatusCode.Processing, message: `Processing (${HttpStatusCode.Processing})` },
        { code: HttpStatusCode.EarlyHints, message: `Early Hints (${HttpStatusCode.EarlyHints})` },
        { code: HttpStatusCode.Ok, message: `OK (${HttpStatusCode.Ok})` },
        { code: HttpStatusCode.Created, message: `Created (${HttpStatusCode.Created})` },
        { code: HttpStatusCode.Accepted, message: `Accepted (${HttpStatusCode.Accepted})` },
        { code: HttpStatusCode.NonAuthoritativeInformation, message: `Non Authoritative Information (${HttpStatusCode.NonAuthoritativeInformation})` },
        { code: HttpStatusCode.NoContent, message: `No Content (${HttpStatusCode.NoContent})` },
        { code: HttpStatusCode.ResetContent, message: `Reset Content (${HttpStatusCode.ResetContent})` },
        { code: HttpStatusCode.PartialContent, message: `Partial Content (${HttpStatusCode.PartialContent})` },
        { code: HttpStatusCode.MultiStatus, message: `MultiStatus (${HttpStatusCode.MultiStatus})` },
        { code: HttpStatusCode.AlreadyReported, message: `Already Reported (${HttpStatusCode.AlreadyReported})` },
        { code: HttpStatusCode.ImUsed, message: `I am Used (${HttpStatusCode.ImUsed})` },
        { code: HttpStatusCode.MultipleChoices, message: `Multiple Choices (${HttpStatusCode.MultipleChoices})` },
        { code: HttpStatusCode.MovedPermanently, message: `Moved Permanently (${HttpStatusCode.MovedPermanently})` },
        { code: HttpStatusCode.Found, message: `Found (${HttpStatusCode.Found})` },
        { code: HttpStatusCode.SeeOther, message: `See Other (${HttpStatusCode.SeeOther})` },
        { code: HttpStatusCode.NotModified, message: `Not Modified (${HttpStatusCode.NotModified})` },
        { code: HttpStatusCode.UseProxy, message: `Use Proxy (${HttpStatusCode.UseProxy})` },
        { code: HttpStatusCode.Unused, message: `Unused (${HttpStatusCode.Unused})` },
        { code: HttpStatusCode.TemporaryRedirect, message: `Temporary Redirect (${HttpStatusCode.TemporaryRedirect})` },
        { code: HttpStatusCode.PermanentRedirect, message: `Permanent Redirect (${HttpStatusCode.PermanentRedirect})` },
        { code: HttpStatusCode.BadRequest, message: `Bad Request (${HttpStatusCode.BadRequest})` },
        { code: HttpStatusCode.Unauthorized, message: `Unauthorized (${HttpStatusCode.Unauthorized})` },
        { code: HttpStatusCode.PaymentRequired, message: `Payment Required (${HttpStatusCode.PaymentRequired})` },
        { code: HttpStatusCode.Forbidden, message: `Forbidden (${HttpStatusCode.Forbidden})` },
        { code: HttpStatusCode.NotFound, message: `Not Found (${HttpStatusCode.NotFound})` },
        { code: HttpStatusCode.MethodNotAllowed, message: `Method Not Allowed (${HttpStatusCode.MethodNotAllowed})` },
        { code: HttpStatusCode.NotAcceptable, message: `Not Acceptable (${HttpStatusCode.NotAcceptable})` },
        { code: HttpStatusCode.ProxyAuthenticationRequired, message: `Proxy Authentication Required (${HttpStatusCode.ProxyAuthenticationRequired})` },
        { code: HttpStatusCode.RequestTimeout, message: `Request Timeout (${HttpStatusCode.RequestTimeout})` },
        { code: HttpStatusCode.Conflict, message: `Conflict (${HttpStatusCode.Conflict})` },
        { code: HttpStatusCode.Gone, message: `Gone (${HttpStatusCode.Gone})` },
        { code: HttpStatusCode.LengthRequired, message: `Length Required (${HttpStatusCode.LengthRequired})` },
        { code: HttpStatusCode.PreconditionFailed, message: `Pre-Condition Failed (${HttpStatusCode.PreconditionFailed})` },
        { code: HttpStatusCode.PayloadTooLarge, message: `Payload Too Large (${HttpStatusCode.PayloadTooLarge})` },
        { code: HttpStatusCode.UriTooLong, message: `URI Too Long (${HttpStatusCode.UriTooLong})` },
        { code: HttpStatusCode.UnsupportedMediaType, message: `UnSupported Media Type (${HttpStatusCode.UnsupportedMediaType})` },
        { code: HttpStatusCode.RangeNotSatisfiable, message: `Range Not Satisfiable (${HttpStatusCode.RangeNotSatisfiable})` },
        { code: HttpStatusCode.ExpectationFailed, message: `Expectation Failed (${HttpStatusCode.ExpectationFailed})` },
        { code: HttpStatusCode.ImATeapot, message: `I'm a Teapot (${HttpStatusCode.ImATeapot})` },
        { code: HttpStatusCode.MisdirectedRequest, message: `Misdirection Request (${HttpStatusCode.MisdirectedRequest})` },
        { code: HttpStatusCode.UnprocessableEntity, message: `Unprocessable Entity (${HttpStatusCode.UnprocessableEntity})` },
        { code: HttpStatusCode.Locked, message: `Locked (${HttpStatusCode.Locked})` },
        { code: HttpStatusCode.FailedDependency, message: `Failed Dependency (${HttpStatusCode.FailedDependency})` },
        { code: HttpStatusCode.TooEarly, message: `Too Early (${HttpStatusCode.TooEarly})` },
        { code: HttpStatusCode.UpgradeRequired, message: `Upgrade Required (${HttpStatusCode.UpgradeRequired})` },
        { code: HttpStatusCode.PreconditionRequired, message: `Pre-Condition Required (${HttpStatusCode.PreconditionRequired})` },
        { code: HttpStatusCode.TooManyRequests, message: `Too Many Requests (${HttpStatusCode.TooManyRequests})` },
        { code: HttpStatusCode.RequestHeaderFieldsTooLarge, message: `Request Header Fields Too Large (${HttpStatusCode.RequestHeaderFieldsTooLarge})` },
        { code: HttpStatusCode.UnavailableForLegalReasons, message: `Unavailable For Legal Reasons (${HttpStatusCode.UnavailableForLegalReasons})` },
        { code: HttpStatusCode.InternalServerError, message: `Internal Server Error (${HttpStatusCode.InternalServerError})` },
        { code: HttpStatusCode.NotImplemented, message: `Not Implemented (${HttpStatusCode.NotImplemented})` },
        { code: HttpStatusCode.BadGateway, message: `Bad Gateway (${HttpStatusCode.BadGateway})` },
        { code: HttpStatusCode.ServiceUnavailable, message: `Service Unavailable (${HttpStatusCode.ServiceUnavailable})` },
        { code: HttpStatusCode.GatewayTimeout, message: `Gateway Timeout (${HttpStatusCode.GatewayTimeout})` },
        { code: HttpStatusCode.HttpVersionNotSupported, message: `HTTP Version Not Supported (${HttpStatusCode.HttpVersionNotSupported})` },
        { code: HttpStatusCode.VariantAlsoNegotiates, message: `Variant Also Negotiates (${HttpStatusCode.VariantAlsoNegotiates})` },
        { code: HttpStatusCode.InsufficientStorage, message: `Insufficient Storage (${HttpStatusCode.InsufficientStorage})` },
        { code: HttpStatusCode.LoopDetected, message: `Loop Detected (${HttpStatusCode.LoopDetected})` },
        { code: HttpStatusCode.NotExtended, message: `Not Extended (${HttpStatusCode.NotExtended})` },
        { code: HttpStatusCode.NetworkAuthenticationRequired, message: `Network Authentication Required (${HttpStatusCode.NetworkAuthenticationRequired})` },
    ],
}