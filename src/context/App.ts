import moment from "moment";
import { Investment } from "../model/investment.model";
import { authService } from "./../services/Authentication.Service";
const { REACT_APP_BASE_URL, REACT_APP_WalletAddress, REACT_APP_ReferralBonus, REACT_APP_UploadBaseUrl, REACT_APP_UploadPreset } =
    process.env;

export const AppUrl = () => REACT_APP_BASE_URL || "";

export const WalletAddress = () => REACT_APP_WalletAddress || "";

export const ReferralBonus = () => REACT_APP_ReferralBonus || 6;

export const AppUploadUrl = () => REACT_APP_UploadBaseUrl || "";

export const UploadPreset = () => REACT_APP_UploadPreset || "";

export const AppName = "Timo Stephan Investment";

export const CleanMessage = (message: string) => {
    if (message?.includes("Unauthorized access!")) {
        authService.Logout();
        window.location.reload();
    }
    return message.replace("GraphQL error:", "").replace("Network error:", "");
};

export const CleanDate = (date: string, onlyDate = false, short = true) =>
    onlyDate
        ? Intl.DateTimeFormat("en-GB", {
              month: short ? "short" : "long",
              year: "numeric",
              weekday: short ? "short" : "long",
              day: "numeric"
          }).format(new Date(date))
        : Intl.DateTimeFormat("en-GB", {
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              hour12: false,
              month: short ? "short" : "long",
              year: "numeric",
              weekday: short ? "short" : "long",
              day: "numeric"
          }).format(new Date(date));

export const toCurrency = (value: any): string => {
    if (value) {
        return Intl.NumberFormat("en-GB").format(value);
    }
    return "0";
};

export const GetValueFromURL = (name: string, url: string = ""): string => {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) {
        return "";
    }
    if (!results[2]) {
        return "";
    }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

/**
 * copies text to clipboard
 * @param parentId parent container's id
 * @param content content to copy to clipboard
 */
export const CopyToClipboard = (parentId: string, content: string) => {
    /** Create element */
    const textField = document.createElement("textarea");
    textField.innerText = content;
    const parentElement = document.getElementById(parentId);
    parentElement?.appendChild(textField);
    /** Select text */
    if (isIOS()) {
        let range = document.createRange();
        range.selectNodeContents(textField);
        let selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
        textField.setSelectionRange(0, 999999);
    } else {
        textField.select();
    }
    // copy and remove element
    document.execCommand("copy");
    parentElement?.removeChild(textField);

    alert("Address copied to clipboard!");
};

function isIOS() {
    return navigator.userAgent.match(/ipad|iphone/i);
}

export const DefaultImage = "https://res.cloudinary.com/obaforex/image/upload/v1620379912/assets/imgs/isgpp_avatar_placeholder_l8cm9b.png";

export const DefaultImageFromURL = (name: String) =>
    `https://ui-avatars.com/api/?length=1&size=128&name=${name}&length=2&background=random&format=svg`;

export const getTotalAmount = (investment: Investment) => {
    return Intl.NumberFormat("en-US", {
        maximumFractionDigits: 2
    }).format(investment.investment_made * (investment.plan.percent / 100) * (investment.duration * 4 + 2));
};

export const getNextPayment = () => {
    const date = moment().startOf("week").add(5, "days");
    return date.toISOString();
};
