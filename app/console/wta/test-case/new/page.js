'use client'

import React from "react";
import { useState, useEffect, useRef } from "react";
import { CloudUpload, LogOut } from "lucide-react";
import { CreateTestCaseApiResponse } from "@/app/lib/models_wta/TestCasesApiResponse";
import { apiClient } from "@/app/lib/api/apiClient_WTA";
import './Form.css';
export default function NewForm() {
  const fileUploadRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [formData, setFormData] = useState({
    feature: '',
    testcasename: '',
    browser: '',
    url: '',
    environment: '',
    file: null,
  });
  const [formErrors, setErrorData] = useState({
    feature: '',
    testcasename: '',
    browser: '',
    url: '',
    environment: '',
    file: '',
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(e.target.files);
    if (file) {
      setSelectedFileName(file.name);
      setFormData((prevData) => ({
        ...prevData,
        file: file, // Update the file in the formData state
      }));
      setErrorData((prevErrors) => ({
        ...prevErrors,
        file: '', // Clear the error message for the file
      }));
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrorData((prevErrors) => ({
      ...prevErrors,
      [name]: '', // Reset the specific error when the user starts typing
    }));
    console.log('Form Data Submitted:', formData);
  };

  const validate = () => {
    let errors = { ...formErrors };
    console.log("file", formData.file);
    if (!formData.feature) {
      errors.feature = 'Feature is required';
    }
    else if (!formData.file) {
      errors.file = 'File is required';
    }
    else {
      setErrorData({
        feature: '',
        testcasename: '',
        browser: '',
        url: '',
        environment: '',
        file: '',
      });
    }
    return errors;

  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = validate();
    console.log(errors.feature);

    setErrorData((prevErrorData) => ({
      ...prevErrorData, // Keep the previous error data
      ...errors, // Update only the fields that have errors
    }));

    if (errors && !errors.feature && !errors.file) {


      // const dataToSend = new FormData();
      // dataToSend.append('feature', formData.feature);
      // dataToSend.append('testcasename', formData.testcasename);
      // dataToSend.append('browser', formData.browser);
      // dataToSend.append('url', formData.url);
      // dataToSend.append('environment', formData.environment);
      // dataToSend.append('file', formData.file);

      apiClient.addNewTestCase(formData)
        .then((response) => {
          //setIsLoading(false);
          console.log("final response", response);
          if (response.isError) {

            setErrorMessage(response.errorMessage || "Failed to add new test method.");
          } else {
            if (response.testCase == null) {
              setErrorMessage("Failed to add new test method.");
              return;
            }
            // const url = RoutePaths.Recording(`mta`, `${response.testCase.testCaseUUID}`);
            // router.replace(url)
          }
        })
        .catch((error) => {
          console.log(error)
        })

      setFormData({
        feature: '',
        testcasename: '',
        browser: '',
        url: '',
        environment: '',
        file: null,
      });
      setSelectedFileName(null);
      if (fileUploadRef.current) {
        fileUploadRef.current.value = '';
      }

      console.log('Form Data Submitted:', formData);
    }


  }
  const loadExtension = () => {
    console.log('Loading extension...');
    const EXTENSION_ID = 'gcbalfbdmfieckjlnblleoemohcganoc';
    const WEBSTORE_URL = `https://chromewebstore.google.com/detail/${EXTENSION_ID}`;
    window.open(WEBSTORE_URL, '_blank');

    // Optional: alert or toast message
    alert('Opening the Chrome Web Store. Please click "Add to Chrome" to install the extension.');

    // Optional: Check later if it's installed (only in Chrome + if the extension supports it)
    setTimeout(() => {
      if (window.chrome?.runtime) {
        window.chrome.runtime.sendMessage(
          EXTENSION_ID,
          { type: 'ping' },
          (response) => {
            if (chrome.runtime.lastError || !response) {
              console.log('Extension is not installed yet.');
            } else {
              console.log('Extension is installed and responding:', response);
            }
          }
        );
      }
    }, 5000);



  }
  return (
    <>
      <title>Create Test Case | Script less</title>
      <meta name="description" content="Create New Test Case" />
      <div>
        <div className="form-container">
          <div className="form-box">
            <h2 className="form-title">Create New Test Case</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="feature" className="form-label">Feature</label>
                <input
                  type="text"
                  id="feature"
                  name="feature"
                  value={formData.feature}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter Feature Name"

                />
                {formErrors.feature && <span className="error">{formErrors.feature}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="testcasename" className="form-label">Test Case Name</label>
                <input
                  type="text"
                  id="testcasename"
                  name="testcasename"
                  value={formData.testcasename}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter Test Case Name"
                />
              </div>
              <div className="form-field">
                <label htmlFor="browser" className="form-label">Browser</label>
                <input
                  type="text"
                  id="browser"
                  name="browser"
                  value={formData.browser}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter Browser Name"
                />
              </div>

              <div className="form-field">
                <label htmlFor="file-upload" className="form-label">Config File</label>
                <div className="custom-file-input">
                  <input
                    type="file"
                    id="file-upload"
                    name="file"
                    accept=".json"
                    ref={fileUploadRef}
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <label htmlFor="file-upload" className="file-label ">
                    {selectedFileName ? `${selectedFileName}` : (
                      <span className="flex items-center justify-center">
                        <CloudUpload />
                        <span className="font-semibold">Upload</span>
                      </span>
                    )}
                  </label>
                </div>
                {formErrors.file && <span className="error">{formErrors.file}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="url" className="form-label">URL</label>
                <input
                  type="text"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter URL"
                />
              </div>

              <div className="form-field">
                <label htmlFor="environment" className="form-label">Environment</label>
                <input
                  type="text"
                  id="environment"
                  name="environment"
                  value={formData.environment}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter Environment"
                />
              </div>
              <div className="form-submit form-field">
                <span><button type="button" onClick={loadExtension} className="form-button">Record and Save</button>
                </span> &nbsp; &nbsp;
                <span><button type="submit" className="form-button">Save</button></span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}