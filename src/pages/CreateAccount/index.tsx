import React, { FC, useState } from "react";
import { Helmet } from "react-helmet";
import { AppName } from "../../context/App";
import PrimaryButton, { ButtonType } from "../../components/Button";
import { ArrowLeft, UserPlus, ArrowRight, LogIn as LoginIcon } from "@styled-icons/feather";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import countries from "../../data/country.json";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/react-hooks";
import { NEW_ACCOUNT } from "../../queries/user.query";
import { authService } from "../../services/Authentication.Service";
import { CleanMessage } from "./../../context/App";
import AccountType from "../../data/account-type.json";
import WalletNames from "../../data/wallet-name.json";

interface iProp {
    history?: any;
    location?: any;
}

const CreateAccount: FC<iProp> = ({ history, location }) => {
    document.body.className = "login";
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [user, setUser] = useState<any>({});

    const [createFunc, { loading }] = useMutation(NEW_ACCOUNT, {
        onCompleted: (data) => {
            if (data.NewUserAccount) {
                const { token, doc, message } = data.NewUserAccount;
                authService.Login(doc, token);
                toast.success(message);
                const { from } = location.state || {
                    from: { pathname: "/app" }
                };
                setTimeout(() => {
                    window.document.location.href = from.pathname;
                }, 500);
            }
        },
        onError: (error) => toast.error(CleanMessage(error.message))
    });

    return (
        <>
            <Helmet>
                <title>
                    {t("join")} | {AppName}
                </title>
            </Helmet>

            <div className="container sm:px-10">
                <div className="block xl:grid grid-cols-2 gap-4">
                    <div className="hidden xl:flex flex-col min-h-screen">
                        <a href="/" className="-intro-x flex items-center pt-5">
                            <img alt="Investment bot" className="w-6" src="dist/images/icon.png" />
                            <span className="text-theme-1 text-lg ml-3">
                                Timo Stephan<span className="font-medium">Investment</span>
                            </span>
                        </a>
                        <div className="my-auto">
                            <img alt="investment bot" className="-intro-x w-3/4 -mt-16" src="/dist/images/login-bg.svg" />
                            <div className="-intro-x text-theme-1 font-medium text-4xl leading-tight mt-10">
                                {t("login_title")}
                                <br />
                                {t("sign_up_title_2")}
                            </div>
                            <div className="-intro-x mt-5 text-lg text-theme-1">{t("login_title_desc")}</div>
                        </div>
                    </div>

                    <div className="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
                        <div className="my-auto mx-auto xl:ml-20 bg-white xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-3/4 xl:w-3/4">
                            <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">{t("join")}</h2>
                            <div className="intro-x mt-2 text-gray-500 xl:hidden text-center">{t("login_desc")}</div>
                            <form
                                onSubmit={async (event) => {
                                    event.preventDefault();
                                    if (user.password !== user.re_password) {
                                        toast.warn(t("password_mismatch"));
                                    } else {
                                        const option = {
                                            device: navigator.vendor,
                                            userAgent: navigator.userAgent
                                        };
                                        const { re_password, referralCode, ...rest } = user;
                                        // if(rest.email && rest.phone && rest.)
                                        await createFunc({
                                            variables: { option, model: { ...rest, walletName: "BTC" }, referrer: referralCode }
                                        });
                                    }
                                }}
                            >
                                <div className="intro-x mt-8">
                                    {step === 1 && (
                                        <>
                                            <div className="grid gap-2 grid-cols-2">
                                                <div>
                                                    <label htmlFor="fName">{t("name.first.label")}</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        defaultValue={user?.firstname}
                                                        className="intro-x input w-full input--lg border border-gray-300"
                                                        onChange={({ currentTarget }) =>
                                                            setUser({
                                                                ...user,
                                                                firstname: currentTarget.value
                                                            })
                                                        }
                                                        placeholder={t("name.first.label")}
                                                    />
                                                </div>

                                                <div className="">
                                                    <label htmlFor="lName">{t("name.last.label")}</label>
                                                    <input
                                                        onChange={({ target }) =>
                                                            setUser({
                                                                ...user,
                                                                lastname: target.value
                                                            })
                                                        }
                                                        defaultValue={user?.lastname}
                                                        required
                                                        type="text"
                                                        className="intro-x input w-full input--lg border border-gray-300 block"
                                                        placeholder={t("name.last.label")}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <label htmlFor="email">{t("email.label")}</label>
                                                <input
                                                    required
                                                    defaultValue={user?.email}
                                                    onChange={({ currentTarget }) =>
                                                        setUser({
                                                            ...user,
                                                            email: currentTarget.value
                                                        })
                                                    }
                                                    type="email"
                                                    className="intro-x input w-full input--lg border border-gray-300 block"
                                                    name="email"
                                                    placeholder={t("email.label")}
                                                />
                                            </div>
                                            <div className="mt-4">
                                                <label htmlFor="phone">{t("phone.label")}</label>
                                                <input
                                                    onChange={({ target }) =>
                                                        setUser({
                                                            ...user,
                                                            phone: target.value
                                                        })
                                                    }
                                                    required
                                                    type="text"
                                                    className="intro-x input w-full input--lg border border-gray-300 block"
                                                    placeholder={t("phone.label")}
                                                    defaultValue={user?.phone}
                                                />
                                            </div>
                                            <div className="intro-x mt-4">
                                                <div className="grid gap-2 grid-cols-2">
                                                    <div>
                                                        <label htmlFor="account">Account Type</label>
                                                        <Select
                                                            id="accountType"
                                                            isMulti={false}
                                                            defaultValue={user?.accountType}
                                                            onChange={(item: any) =>
                                                                setUser({
                                                                    ...user,
                                                                    accountType: item.value
                                                                })
                                                            }
                                                            placeholder="Select type"
                                                            options={AccountType}
                                                            required
                                                            theme={(theme) => ({
                                                                ...theme,
                                                                colors: {
                                                                    ...theme.colors,
                                                                    primary25: "#a996e0",
                                                                    primary: "#574294"
                                                                }
                                                            })}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="gender">{t("gender.label")}</label>
                                                        <Select
                                                            id="gender"
                                                            isMulti={false}
                                                            required
                                                            defaultValue={user?.gender}
                                                            onChange={(item: any) =>
                                                                setUser({
                                                                    ...user,
                                                                    gender: item.value
                                                                })
                                                            }
                                                            placeholder={t("gender.label")}
                                                            options={[
                                                                { value: "Male", label: "Male" },
                                                                { value: "Female", label: "Female" },
                                                                { value: "Others", label: "Others" }
                                                            ]}
                                                            theme={(theme) => ({
                                                                ...theme,
                                                                colors: {
                                                                    ...theme.colors,
                                                                    primary25: "#a996e0",
                                                                    primary: "#574294"
                                                                }
                                                            })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <label htmlFor="nation">{t("nation.label")}</label>
                                                <Select
                                                    onChange={(item: any) =>
                                                        setUser({
                                                            ...user,
                                                            nationality: item.value
                                                        })
                                                    }
                                                    required
                                                    className="border-theme-1"
                                                    isMulti={false}
                                                    defaultValue={user?.nationality}
                                                    placeholder={t("nation.label")}
                                                    options={countries.map((item) => ({
                                                        value: item.name,
                                                        label: item.name
                                                    }))}
                                                    theme={(theme) => ({
                                                        ...theme,
                                                        colors: {
                                                            ...theme.colors,
                                                            primary25: "#a996e0",
                                                            primary: "#574294"
                                                        }
                                                    })}
                                                />
                                            </div>
                                        </>
                                    )}
                                    {step === 2 && (
                                        <>
                                            <div className="mt-4">
                                                <label htmlFor="walletName">Wallet</label>
                                                <Select
                                                    id="walletName"
                                                    isMulti={false}
                                                    defaultValue={user?.walletName}
                                                    onChange={(item: any) =>
                                                        setUser({
                                                            ...user,
                                                            walletName: item.value
                                                        })
                                                    }
                                                    placeholder="Select Wallet"
                                                    options={WalletNames}
                                                    required
                                                />
                                            </div>
                                            <div className="mt-4">
                                                <label htmlFor="wallet">{t("wallet.label")}</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="input w-full input--lg border border-gray-300 block"
                                                    onChange={({ currentTarget: { value } }) =>
                                                        setUser({
                                                            ...user,
                                                            walletAddress: value
                                                        })
                                                    }
                                                    placeholder={t("wallet.label")}
                                                    defaultValue={user?.walletAddress}
                                                />
                                            </div>

                                            <div className="mt-4">
                                                <label htmlFor="dob">{t("dob.label")}</label>
                                                <input
                                                    onChange={({ target }) =>
                                                        setUser({
                                                            ...user,
                                                            dob: target.value
                                                        })
                                                    }
                                                    required
                                                    type="date"
                                                    className="intro-x input w-full input--lg border border-gray-300 block"
                                                    name="dob"
                                                    title="Data of birth"
                                                    placeholder={t("dob.label")}
                                                    defaultValue={user?.dob}
                                                />
                                            </div>

                                            <div className="mt-4">
                                                <label htmlFor="ContactAddress">{t("ContactAddress")}</label>
                                                <input
                                                    onChange={({ target }) =>
                                                        setUser({
                                                            ...user,
                                                            address: target.value
                                                        })
                                                    }
                                                    type="text"
                                                    required
                                                    className="intro-x input w-full input--lg border border-gray-300 block"
                                                    name="ContactAddress"
                                                    id="ContactAddress"
                                                    placeholder={t("address.label")}
                                                    defaultValue={user?.address}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="duration">Duration</label>
                                                <Select
                                                    id="duration"
                                                    required
                                                    isMulti={false}
                                                    defaultValue={{ value: user.duration, label: user.duration }}
                                                    onChange={(item: any) =>
                                                        setUser({
                                                            ...user,
                                                            duration: item.value
                                                        })
                                                    }
                                                    placeholder="Select Duration"
                                                    options={[
                                                        { value: "1 Year", label: "1 Year" },
                                                        { value: "6 Months", label: "6 Months" }
                                                    ]}
                                                />
                                            </div>
                                            <div className="mt-4">
                                                <label htmlFor="referral_code">{t("referral_code")}</label>
                                                <input
                                                    onChange={({ currentTarget: { value } }) =>
                                                        setUser({
                                                            ...user,
                                                            referralCode: value
                                                        })
                                                    }
                                                    type="text"
                                                    name="referral code"
                                                    id="referral_code"
                                                    className="input w-full input--lg border border-gray-300 block"
                                                    placeholder={t("referral_code")}
                                                    defaultValue={user?.referralCode}
                                                />
                                            </div>

                                            <div className="mt-4">
                                                <label htmlFor="password">{t("password.label")}</label>
                                                <input
                                                    onChange={({ currentTarget: { value } }) =>
                                                        setUser({
                                                            ...user,
                                                            password: value
                                                        })
                                                    }
                                                    required
                                                    type="password"
                                                    className="intro-x input w-full input--lg border border-gray-300 block"
                                                    placeholder={t("password.label")}
                                                    defaultValue={user?.password}
                                                />
                                            </div>

                                            <div className="mt-4">
                                                <label htmlFor="password">{t("password.confirm.text")}</label>
                                            </div>
                                            <input
                                                onChange={({ currentTarget: { value } }) =>
                                                    setUser({
                                                        ...user,
                                                        re_password: value
                                                    })
                                                }
                                                type="password"
                                                required
                                                className="intro-x input w-full input--lg border border-gray-300 block"
                                                placeholder={t("password.confirm.text")}
                                                defaultValue={user?.re_password}
                                            />
                                        </>
                                    )}
                                </div>

                                {step === 2 && (
                                    <>
                                        <div className="intro-x flex items-center text-gray-700 mt-4 text-xs sm:text-sm">
                                            <input type="checkbox" className="input border mr-2" id="remember-me" />
                                            <label className="cursor-pointer select-none" htmlFor="remember-me">
                                                {t("agree")} {AppName}
                                            </label>
                                            <a className="text-theme-1 ml-1" href="/">
                                                {t("policy")}
                                            </a>
                                            .
                                        </div>
                                        <div className="intro-x mt-5 xl:mt-8 text-center xl:text-left">
                                            <PrimaryButton
                                                type={ButtonType.submit}
                                                loading={loading}
                                                className="button button--lg w-full xl:w-32 text-white bg-theme-1 xl:mr-3"
                                            >
                                                {t("btn-register")} <UserPlus className="ml-3 h-6" />
                                            </PrimaryButton>
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="button button--lg w-full xl:w-32 text-gray-700 border border-gray-300 mt-3 xl:mt-0"
                                            >
                                                <ArrowLeft className="ml-1 h-6 text-theme-1" /> {t("pagination.previous")}
                                            </button>
                                        </div>
                                    </>
                                )}
                                {step === 1 && (
                                    <div className="intro-x mt-5 xl:mt-8 text-center xl:text-left">
                                        <PrimaryButton
                                            onClick={() => setStep(2)}
                                            type={ButtonType.button}
                                            loading={false}
                                            className="button button--lg w-full xl:w-32 text-white bg-theme-1 xl:mr-3"
                                        >
                                            {t("pagination.next")} <ArrowRight className="ml-3 h-6" />
                                        </PrimaryButton>
                                        <button
                                            type="button"
                                            onClick={() => history.push("/")}
                                            className="button button--lg w-full xl:w-32 text-gray-700 border border-gray-300 mt-3 xl:mt-0"
                                        >
                                            <LoginIcon className="mr-3 h-6 text-theme-1" /> {t("login.caption")}
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateAccount;
