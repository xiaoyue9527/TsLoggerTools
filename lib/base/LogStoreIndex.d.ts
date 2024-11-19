declare const SLSIndexJson: {
    accessLogs: {
        max_text_len: number;
        log_reduce_white_list: never[];
        log_reduce_black_list: never[];
        line: {
            chn: boolean;
            caseSensitive: boolean;
            token: string[];
        };
        keys: {
            traceId: {
                chn: boolean;
                caseSensitive: boolean;
                token: string[];
                alias: string;
                type: string;
                doc_value: boolean;
            };
            timestamp: {
                chn: boolean;
                caseSensitive: boolean;
                token: string[];
                alias: string;
                type: string;
                doc_value: boolean;
            };
            ipAddress: {
                chn: boolean;
                caseSensitive: boolean;
                token: string[];
                alias: string;
                type: string;
                doc_value: boolean;
            };
            userId: {
                chn: boolean;
                caseSensitive: boolean;
                token: string[];
                alias: string;
                type: string;
                doc_value: boolean;
            };
        };
        index_all: boolean;
        max_depth: number;
        json_keys: {};
    };
    applicationLogs: {
        max_text_len: number;
        log_reduce_white_list: never[];
        log_reduce_black_list: never[];
        line: {
            chn: boolean;
            caseSensitive: boolean;
            token: string[];
        };
        keys: {
            traceId: {
                chn: boolean;
                caseSensitive: boolean;
                token: string[];
                alias: string;
                type: string;
                doc_value: boolean;
            };
            timestamp: {
                chn: boolean;
                caseSensitive: boolean;
                token: string[];
                alias: string;
                type: string;
                doc_value: boolean;
            };
            userId: {
                chn: boolean;
                caseSensitive: boolean;
                token: string[];
                alias: string;
                type: string;
                doc_value: boolean;
            };
            spanId: {
                chn: boolean;
                caseSensitive: boolean;
                token: string[];
                alias: string;
                type: string;
                doc_value: boolean;
            };
            parentSpanId: {
                chn: boolean;
                caseSensitive: boolean;
                token: string[];
                alias: string;
                type: string;
                doc_value: boolean;
            };
            eventType: {
                chn: boolean;
                caseSensitive: boolean;
                token: string[];
                alias: string;
                type: string;
                doc_value: boolean;
            };
        };
        index_all: boolean;
        max_depth: number;
        json_keys: {};
    };
};
export default SLSIndexJson;
