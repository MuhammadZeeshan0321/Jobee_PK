

function WorkHistoryForm() {


    return (
        <View style={styles.headerContainer}>
            <KeyboardAwareScrollView
                style={styles.container1}
                enableOnAndroid
                //enableAutomaticScroll
                enableResetScrollToCoords={false}
                automaticallyAdjustContentInsets={false}
                keyboardShouldPersistTaps='always'
                keyboardOpeningTime={0}
                extraHeight={Platform.select({ android: 250 })} >
                <View style={styles.textcontainer}>
                    <View>
                        <TouchableWithoutFeedback onPress={() => this.childViewRender('Job Title')}>
                            <View>
                                <TextField
                                    label="Job Title" value={jobTitle === undefined ? '' : jobTitle.Text} disabled
                                    disabledLineType={'solid'}
                                    disabledLineWidth={0.5}
                                    ref={this.designationRef} onFocus={this.onFocus} error={errors.designation} labelTextStyle={{ fontFamily: fonts.regular }} titleTextStyle={{ fontFamily: fonts.regular }} style={{ fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular', color: '#000' }}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View>
                        <TouchableWithoutFeedback onPress={() => this.childViewRender('Company')}>
                            <View>
                                <TextField
                                    label="Company" value={companyName === undefined ? '' : companyName.Text} disabled
                                    disabledLineType={'solid'}
                                    disabledLineWidth={0.5}
                                    ref={this.companyRef} onFocus={this.onFocus} error={errors.company} labelTextStyle={{ fontFamily: fonts.regular }} titleTextStyle={{ fontFamily: fonts.regular }} style={{ fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular', color: '#000' }}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity onPress={this._showFromDateTimePicker} >
                            <View>
                                <TextField
                                    label="Duration From" value={durationFrom} disabled
                                    disabledLineType={'solid'}
                                    disabledLineWidth={0.5}
                                    ref={this.durationfromRef} onFocus={this.onFocus} error={errors.durationfrom} labelTextStyle={{ fontFamily: fonts.regular }} titleTextStyle={{ fontFamily: fonts.regular }} style={{ fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular', color: '#000' }}
                                />
                            </View>
                        </TouchableOpacity>
                        {/* <DateTimePicker
                maximumDate={new Date()}
                date={durationFrom === '' ? new Date() :  moment([durationFrom.split('/')[1], durationFrom.split('/')[0] - 1, '01']).toDate()}
                isVisible={isVisibledurationFrom}
                onConfirm={this._handleFromDatePicked}
                onCancel={this._hideFromDateTimePicker}
                mode='date'
                datePickerModeAndroid='calendar'
              /> */}
                    </View>
                    <View style={{ marginTop: 35 }}>
                        <CheckBox
                            label='I am currently working here.'
                            labelBefore={true}
                            labelStyle={{ marginLeft: -10, fontFamily: fonts.regular, color: '#00bac9' }}
                            checkboxStyle={{ height: 20, width: 20 }}
                            checked={isPresent}
                            onChange={(isChecked) => this.setState({ isPresent: !isChecked, durationTo: '' })}
                        />
                    </View>
                    {
                        !isPresent &&
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity
                                onPress={this._showToDateTimePicker} >
                                <View>
                                    <TextField
                                        label="Duration To" value={durationTo} disabled labelTextStyle={{ fontFamily: fonts.regular }} titleTextStyle={{ fontFamily: fonts.regular }} style={{ fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular', color: '#000' }}
                                        disabledLineType={'solid'}
                                        disabledLineWidth={0.5}
                                        ref={this.durationToRef} onFocus={this.onFocus} error={errors.durationTo}
                                    />
                                </View>
                            </TouchableOpacity>
                            {/* <DateTimePicker
                isVisible={isVisibledurationTo}
                onConfirm={this._handleToDatePicked}
                date={ durationTo === '' ? new Date() : moment([durationTo.split('/')[1], durationTo.split('/')[0] - 1, '01']).toDate()}
                maximumDate={new Date()}
                onCancel={this._hideToDateTimePicker}
                mode='date'
                datePickerModeAndroid='calendar'
              /> */}
                        </View>
                    }
                    <TextField
                        label="Reference Email"
                        maxLength={150}
                        keyboardType='email-address'
                        value={referenceEmail === null ? '' : referenceEmail}
                        onChangeText={email =>
                            this.setState({
                                referenceEmail: email
                            })
                        }
                        labelTextStyle={{ fontFamily: fonts.regular }} titleTextStyle={{ fontFamily: fonts.regular }}
                        style={{ fontFamily: fonts.regular }}
                        ref={this.referenceEmailRef} onFocus={this.onFocus} error={errors.referenceEmail}
                    />
                    <TextField
                        label="Reference Number"
                        maxLength={30}
                        keyboardType={Platform.OS === 'android' ? 'email-address' : 'ascii-capable'}
                        value={referenceNumber === null ? '' : referenceNumber}
                        onChangeText={mobile =>
                            this.setState({
                                referenceNumber: mobile
                            })
                        }
                        labelTextStyle={{ fontFamily: fonts.regular }} titleTextStyle={{ fontFamily: fonts.regular }}
                        style={{ fontFamily: fonts.regular }}
                        ref={this.referenceNumberRef} onFocus={this.onFocus} error={errors.referenceNumber}
                    />
                    <View>
                        <TouchableWithoutFeedback onPress={() => this.childViewRender('Country')}>
                            <View>
                                <TextField
                                    label="Country" value={country === undefined ? '' : country.Text} disabled
                                    disabledLineType={'solid'}
                                    disabledLineWidth={0.5}
                                    ref={this.countryRef} onFocus={this.onFocus} error={errors.country} labelTextStyle={{ fontFamily: fonts.regular }} titleTextStyle={{ fontFamily: fonts.regular }} style={{ fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular', color: '#000' }} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    {
                        country.Text === undefined || country.Text.toLowerCase() === 'pakistan' ?
                            <View>
                                <TouchableWithoutFeedback onPress={() => this.childViewRender('City')}>
                                    <View>
                                        <TextField
                                            label="City" value={city === undefined ? '' : city.Text} disabled
                                            disabledLineType={'solid'}
                                            disabledLineWidth={0.5}
                                            ref={this.cityRef} onFocus={this.onFocus} error={errors.city} labelTextStyle={{ fontFamily: fonts.regular }} titleTextStyle={{ fontFamily: fonts.regular }} style={{ fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular', color: '#000' }} />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            :
                            <TextField
                                label="City" value={city === undefined ? '' : city.Text}
                                keyboardType={Platform.OS === 'android' ? 'email-address' : 'ascii-capable'}
                                onChangeText={this.onCityTextChange}
                                labelTextStyle={{ fontFamily: fonts.regular }} titleTextStyle={{ fontFamily: fonts.regular }}
                                style={{ fontFamily: fonts.regular }}
                                ref={this.cityRef} onFocus={this.onFocus} error={errors.city}
                            />
                    }
                    <View>
                        <View style={styles.desContainer}>
                            <Text style={styles.desText}>Description</Text>
                            <TouchableOpacity onPress={() => this.childViewRender('Description')} style={{ width: 50 }}>
                                <View>
                                    <Text style={styles.buttonText}>{discription === '' ? 'Add' : 'Edit'} </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View>
                            {discription === '' ? <Text /> : <HTML html={discription} baseFontStyle={{ fontFamily: fonts.regular }} containerStyle={{ fontFamily: fonts.regular }}
                                tagsStyles={{ fontFamily: fonts.regular }} />}
                        </View>
                    </View>
                    <View style={{ height: 160 }} />
                </View>
                <Modal
                    isVisible={this.state.isVisibledurationFrom}
                // animationIn={'fadeIn'}
                // animationOut={'fadeOut'}
                >
                    <View style={{ height: 360, backgroundColor: '#fff', borderWidth: 1, borderColor: '#00bac9' }}>
                        <MonthSelectorCalendar
                            selectedBackgroundColor={'#00bac9'}
                            minDate={moment('01-01-1947', 'DD-MM-YYYY')}
                            selectedDate={durationFrom === '' ? moment(new Date(), 'MMM YYYY') : moment(moment([durationFrom.split('/')[1], durationFrom.split('/')[0] - 1]).toDate(), 'MMM YYYY', true)} //moment([durationFrom.split('/')[1], durationFrom.split('/')[0] - 1]).toDate()
                            monthTapped={(date) => this._handleFromDatePicked(moment(date).format('MM/YYYY'))}
                            currentMonthTextStyle={{ borderWidth: 1, borderColor: '#00bac9', padding: 5, color: '#22ee11', fontFamily: fonts.regular }}
                            style={{ fontFamily: fonts.regular }}
                            yearTextStyle={{ fontFamily: fonts.regular }}
                            monthTextStyle={{ fontFamily: fonts.regular }}
                            containerStyle={{ fontFamily: fonts.regular }}
                        />
                    </View>
                    <View style={{ backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: 'silver', justifyContent: 'flex-end', alignItems: 'flex-end', borderWidth: 1, borderColor: '#00bac9', borderTopWidth: 0 }}>
                        <TouchableOpacity
                            onPress={this._hideFromDateTimePicker}
                            style={[styles.row, { paddingVertical: 10, paddingHorizontal: 20 }]}>
                            <Text style={[styles.lightText, { fontFamily: fonts.regular, paddingHorizontal: 20, }]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <Modal
                    isVisible={this.state.isVisibledurationTo}
                // animationIn={'fadeIn'}
                // animationOut={'fadeOut'}
                >
                    <View style={{ height: 360, backgroundColor: '#fff', borderWidth: 1, borderColor: '#00bac9' }}>
                        <MonthSelectorCalendar
                            selectedBackgroundColor={'#00bac9'}
                            minDate={moment('01-01-1947', 'DD-MM-YYYY')}
                            selectedDate={durationTo === '' ? moment(new Date(), 'MMM YYYY') : moment(moment([durationTo.split('/')[1], durationTo.split('/')[0] - 1]).toDate(), 'MMM YYYY', true)} //moment([durationFrom.split('/')[1], durationFrom.split('/')[0] - 1]).toDate()
                            monthTapped={(date) => this._handleToDatePicked(moment(date).format('MM/YYYY'))}
                            currentMonthTextStyle={{ borderWidth: 1, borderColor: '#00bac9', padding: 5, color: '#22ee11', fontFamily: fonts.regular }}
                            style={{ fontFamily: fonts.regular }}
                            yearTextStyle={{ fontFamily: fonts.regular }}
                            monthTextStyle={{ fontFamily: fonts.regular }}
                            containerStyle={{ fontFamily: fonts.regular }}
                        />
                    </View>
                    <View style={{ backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: 'silver', justifyContent: 'flex-end', alignItems: 'flex-end', borderWidth: 1, borderColor: '#00bac9', borderTopWidth: 0 }}>
                        <TouchableOpacity
                            onPress={this._hideToDateTimePicker}
                            style={[styles.row, { paddingVertical: 10, paddingHorizontal: 20 }]}>
                            <Text style={[styles.lightText, { fontFamily: fonts.regular, paddingHorizontal: 20, }]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </KeyboardAwareScrollView>
        </View>
    );

}

export default WorkHistoryForm;