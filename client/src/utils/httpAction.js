const httpAction = async (data) => {
    try {
        // Input validation
        if (!data || !data.url) {
            throw new Error("URL is required");
        }

        // Log the URL being called for debugging
        console.log("Making request to:", data.url);
        console.log("Request method:", data.method || "GET");
        console.log("Request body:", data.body);

        // Set up request options
        const requestOptions = {
            method: data.method || "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                ...data.headers // Allow additional headers to be passed
            }
        };

        // Only add body for methods that support it
        const methodsWithBody = ["POST", "PUT", "PATCH", "DELETE"];
        if (data.body && methodsWithBody.includes(requestOptions.method.toUpperCase())) {
            requestOptions.body = JSON.stringify(data.body);
        }

        // Make the request
        const response = await fetch(data.url, requestOptions);
        
        console.log("Response status:", response.status);
        console.log("Response headers:", Object.fromEntries(response.headers.entries()));

        // Handle different content types
        let result;
        const contentType = response.headers.get("content-type");
        
        try {
            if (contentType && contentType.includes("application/json")) {
                result = await response.json();
            } else {
                result = await response.text();
            }
        } catch (parseError) {
            console.warn("Failed to parse response body:", parseError);
            result = null;
        }

        // Check if request was successful
        if (!response.ok) {
            let errorMessage;
            
            // Handle specific HTTP status codes
            switch (response.status) {
                case 404:
                    errorMessage = `Endpoint not found: ${data.url}. Please check if the URL is correct and the server is running.`;
                    break;
                case 400:
                    errorMessage = result?.message || "Bad request. Please check your input data.";
                    break;
                case 401:
                    errorMessage = "Unauthorized. Please check your authentication credentials.";
                    break;
                case 403:
                    errorMessage = "Forbidden. You don't have permission to access this resource.";
                    break;
                case 500:
                    errorMessage = "Internal server error. Please try again later.";
                    break;
                case 503:
                    errorMessage = "Service unavailable. The server is temporarily down.";
                    break;
                default:
                    errorMessage = result?.message || result || `HTTP Error: ${response.status} ${response.statusText}`;
            }

            const error = new Error(errorMessage);
            error.status = response.status;
            error.statusText = response.statusText;
            error.url = data.url;
            error.response = result;
            throw error;
        }

        return result;

    } catch (error) {
        // Enhanced error logging
        console.error("HTTP Action Error Details:");
        console.error("- URL:", data?.url);
        console.error("- Method:", data?.method || "GET");
        console.error("- Error:", error.message);
        console.error("- Status:", error.status);
        
        // Check if it's a network error
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            const networkError = new Error("Network error: Unable to connect to the server. Please check your internet connection and ensure the server is running.");
            networkError.originalError = error;
            throw networkError;
        }
        
        // Re-throw the error so calling code can handle it
        throw error;
    }
};

export default httpAction;