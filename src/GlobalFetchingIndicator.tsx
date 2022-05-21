import React, { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useIsFetching } from 'react-query'

export const GlobalFetchingIndicator = () => {
    const isFetching = useIsFetching();
    useEffect(() => {
        if (isFetching) {
            toast.loading("loading...", { id: "loading" });
        } else {
            toast.dismiss("loading");
        }
    }, [isFetching]);
    return <Toaster position="bottom-left" />
}
