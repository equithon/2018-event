import React, { Component } from 'react';

import ErrorMessageChip from '/client/ui/components/notif-chips/ErrorMessageChip.js';
import SuccessMessageChip from '/client/ui/components/notif-chips/SuccessMessageChip.js';
import Text from '/client/ui/components/Text.js';

export default class FileUpload extends Component {
    constructor(props) {
        super(props);

        this.state = {
            progress: 0,
            inProgress: false,

            errorMessage: '',
        };

        this.handleFileUpload = this.handleFileUpload.bind(this);
    }

    handleFileUpload = name => event => {
        if (event.target.files && event.target.files[0]) {
            // Upload the first file even if multiple files selected
            var file = event.target.files[0];

            // Create an upload instance
            let upload = UserFiles.insert({
                file: file,

                meta: {
                    what: this.props.what
                },

                // Initialize progress tracking UI
                onStart: function() {
                    this.setState({
                        progress: 0,
                        inProgress: true,
                        errorMessage: '',
                    });
                }.bind(this),

                // Display success or error messages
                onUploaded: function(err, fileObj) {
                    if (err) {
                        this.setState({
                            errorMessage: err.reason,
                        });

                        if (this.props.onFailure) this.props.onFailure()
                    } else {
                        this.setState({
                            errorMessage: '',
                        });

                        if (this.props.onSuccess) this.props.onSuccess();
                    }
                }.bind(this),

                onProgress: function(progress, fileObj) {
                    this.setState({
                        progress: progress
                    });
                }.bind(this),

                streams: 'dynamic',
                chunkSize: 'dynamic',
            }, false);  // Start manually

            // Start upload
            upload.start();
        }
    };

    render() {
        return(
            <div className="split-column-row" style={this.props.style}>
                {/* Standard input component */}
                <input style={{ gridArea: 'left' }} disabled={this.props.disabled}
                    type="file" onChange={ this.handleFileUpload('resume') } />

                {/* Progress Bar */}
                { (!this.state.errorMessage) ?
                        <div className="progress-bar-container"
                            style={{
                                gridArea: 'right',
                                backgroundColor: (!this.state.errorMessage) ? '#d5dffa' : 'rgba(127, 10, 10, 0.76)'
                            }}>
                            <div className="progress-bar" style={{ width: this.state.progress + '%' }}>
                                { (this.state.progress > 10 && !this.state.errorMessage) ?
                                    <Text style={{ color: 'white', textAlign: 'center' }} type="body2" text={this.state.progress + '%'} /> :
                                    false
                                }
                            </div>
                        </div> :
                        <div style={{ gridArea: 'right' }}>
                            <ErrorMessageChip errorMessage={this.state.errorMessage} />
                        </div>
                }
            </div>
        );
    }
}
