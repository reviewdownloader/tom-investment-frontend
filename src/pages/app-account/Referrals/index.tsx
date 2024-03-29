import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { AppName, DefaultImageFromURL } from "../../../context/App";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { CleanMessage } from "./../../../context/App";
import { LoadingIcon } from "../../../components/Button";
import { Copy } from "@styled-icons/feather";
import { authService } from "./../../../services/Authentication.Service";
// import { GET_REFERRALS } from "../../../queries/referral.query";
// import ReferrerItems from "./items";
import { GET_COUNT_USER } from "../../../queries/statistics.query";
import { GET_REFERRER, GET_YOUR_REFERRALS } from "../../../queries/user.query";
import { IUser } from "../../../model/user.model";

const YourReferral = () => {
    const { t } = useTranslation();
    const [invest, setInvest] = useState(0);
    const [users, setUsers] = useState<Array<IUser>>([]);
    const [user, setUser] = useState<IUser>();
    // const [items, setItems] = useState<Array<any>>([]);

    const { referralCode, id } = authService.GetUser();
    useQuery(GET_COUNT_USER, {
        onCompleted: (d) => {
            setInvest(d.CountReferral);
        }
    });

    // const { loading, data } = useQuery(GET_REFERRALS, {
    //     onError: (er) => toast.error(CleanMessage(er.message)),
    //     onCompleted: (d) => {
    //         setItems(d.GetReferrals.docs);
    //     }
    // });

    const { loading: _loading } = useQuery(GET_REFERRER, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (d) => {
            setUser(d.GetUser.doc.referrer);
        },
        variables: { id }
    });

    const { loading: __loading } = useQuery(GET_YOUR_REFERRALS, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (d) => {
            setUsers(d.GetYourReferrals.docs);
        }
    });

    return (
        <>
            <Helmet>
                <title>
                    {t("referrer")} | {AppName}
                </title>
            </Helmet>
            <h2 className="intro-y text-lg font-medium mt-10">{t("referrer")}</h2>
            <div className="intro-y col-span-12 flex flex-wrap sm:flex-no-wrap items-center mt-2">
                <div className="mr-2 mx-auto text-gray-600 sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
                    Invite a friend to invest using your referral code
                </div>
                <div className="hidden md:block mx-auto text-gray-600 ">{t("referral.message")}</div>
                <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
                    <div className="w-56 relative text-gray-700">
                        <input
                            title="referral code"
                            defaultValue={referralCode}
                            disabled={true}
                            type="text"
                            className="input w-56 box pr-10 placeholder-theme-13"
                            placeholder="Search..."
                        />
                        <Copy className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" />
                        {/* <i className="" data-feather="search"></i> */}
                    </div>
                </div>
            </div>

            <LoadingIcon className="text-theme-1" loading={_loading || __loading} />

            {/* {items.length > 0 && !loading && <ReferrerItems items={items} />}
            {items.length > 0 && (
                <div className="mt-8 intro-y">
                    <span className="button w-56 rounded-full mr-1 mb-2 bg-theme-14 text-theme-10 font-medium">
                        {t("general.referral")}: {data ? data.GetReferrals.docs.length : 0}
                    </span>
                </div>
            )} */}

            {user && (
                <div className="my-4 intro-y flex items-center box px-4 py-8">
                    <img
                        className="w-20 rounded-full border shadow  mr-4"
                        src={user.image || DefaultImageFromURL(user.name)}
                        alt={user.name}
                    />
                    <div className="mr-auto">
                        <h2 className="font-bold text-lg">{user.name}</h2>
                        <span className="text-gray-600">{user.email}</span>
                    </div>
                    <span className="text-teal-600 font-bold uppercase p-2 bg-teal-100 rounded-lg">Referrer</span>
                </div>
            )}

            {users.length > 0 && (
                <div className="my-4">
                    <div className="mb-2">
                        <h2 className="uppercase text-lg font-medium">Referral list</h2>
                        <div className="w-6 h-1 bg-yellow-600"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4 gap-2 lg:gap-4">
                        {users.map((item, idx) => (
                            <div key={idx} className="intro-y flex items-center box rounded-xl px-4 py-6">
                                <img
                                    className="w-20 rounded-full border shadow  mr-4"
                                    src={item.image || DefaultImageFromURL(item.name)}
                                    alt={item.name}
                                />
                                <div className="mr-auto">
                                    <h2 className="font-bold text-lg">{item.name}</h2>
                                    <span className="text-xs text-gray-600">{item.email}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default YourReferral;
