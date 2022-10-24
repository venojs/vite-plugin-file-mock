interface CommonResponse<T = Record<string, any>, R = number> {
    result: R;
}

export default () => {
    const result: CommonResponse = {
        result: 1,
    };

    return result;
};
