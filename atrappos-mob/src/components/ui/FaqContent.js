import React from 'react';
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


export const FaqContent = () => {

    return (
        <div className="faq">
            <div className = "faq__item">
                <h6 className="faq__title">
                    What's this?
                </h6>
                <div className="faq__text">
                    <p>Atr<b>app</b>os is a simple crowdsourcing mapmaking app.</p>
                    <p>You can create meaningful maps for other urban pedestrians, by drawing paths.</p>
                    <p>You can also see other people's paths, so this is a noble exchange with the walking community.</p>
                </div>
            </div>
            <div className = "faq__item">
                <h6 className="faq__title">
                    What should I do?
                </h6>
                <div className="faq__text">
                    <p>Draw paths, walk paths, evaluate them, and enjoy!</p>
                </div>
            </div>
            <div className = "faq__item">
                <h6 className="faq__title">
                    Evaluate...?
                </h6>
                <div className="faq__text">
                    <p>You will have two <i>required</i> evaluating options: How walkable and how beautiful is the path.</p>
                    <p>The first one will create thicker paths on the map (the more walkable, the more thick).</p>
                    <p>The second one will create paths with different colors (depending on the level of 'beauty').</p>
                    <p>More information included in each area of interest!</p>
                </div>
            </div>
            <div className = "faq__item">
                <h6 className="faq__title">
                    Ok, I get the 'walking' part, but the drawing...?
                </h6>
                <div className="faq__text">
                    <p>
                        Apart from recording a path while you walk (more instructions will follow below about this procedure), you can also draw one (why not?).
                        You can draw areas in places that you have visited and evaluate them according to your impressions. Sorry, no Street View available in this app (like Atr<b>app</b>os Web),
                        you don't need it! Your mobile device is handy and can go anywhere.
                    </p>
                </div>
            </div>
            <div className = "faq__item">
                <h6 className="faq__title">
                    As far as paths are concerned...
                </h6>
                <div className="faq__text">
                    <p>
                        You can <i>create, view, edit and delete</i> your own paths.<br/>
                        You can <i>record a path while you walk</i>, but then you won't be able to edit it by hand (as happens with the drawn paths).
                        However, a service for fixing possible GPS inconsistencies is available (more info will follow).
                        You can only <i>view</i> other people's paths (you should be able to see those meaningful map creations, right?).
                    </p>
                </div>
            </div>
            <div className = "faq__item">
                <h6 className="faq__title">
                    <b>Important info</b>
                </h6>
                <div className="faq__text">
                    <p>
                        You will be able to see the following button at certain places:
                        <span className="faq__tltp">
                           <FontAwesomeIcon icon={faInfoCircle} />
                    </span>
                    </p>
                    <p> Please <i><b className="important-notice">do not ignore this button!</b></i> It may contain
                        useful information for the usage of a nearby element! Trust the info buttons.
                        They exist for your own good <b>:)</b>
                    </p>
                </div>
            </div>
            <div className = "faq__item">
                <h6 className="faq__title">
                    <b>Not-selectable (tappable) elements (buttons, links, etc...)</b>
                </h6>
                <div className="faq__text">
                    <p>
                        If an element is not 'tappable' (able to be tapped!), then we regret that <i>it is not supposed to be</i>.
                        <br/>This is not a reason to get confused, try to perceive the surroundings and
                        your options, then ensure that nothing necessary is missing. Sometimes this happens for your own protection.
                        A button/link may be disabled because if it was tapped, the universe would explode <b>D:</b>
                    </p>
                </div>
            </div>
            <div className = "faq__item">
                <h6 className="faq__title">
                    Recording a path
                </h6>
                <div className="faq__text">
                   You can start recording a path by tapping the button 'Record', which is available at the bottom menu option 'Location'. Make sure that
                    <b className="important-notice"> the GPS button is active (blue)</b>
                    <br/>
                    <div className="bg-map_location bg-faq"/><br/>
                        Also, ensure that
                    <b className="important-notice"> your mobile browser has the necessary permission for sharing your location</b>.<br/>
                    You can record as much distance as you like, you don't have to do anything during the recording (well, not 'anything', if you refresh the app
                    the recording will be lost so be careful), just hold your device tight and be careful in the streets! Also, you can evaluate your path (during or after
                    the recording) by clicking the button 'Evaluation & Features'. The timing of the evaluation is up to you. Just remember that it is necessary for
                    saving your path! After stopping a recording, you will face the following options:
                    <ol>
                        <li><i>Match to Roads</i>: This is a useful options in case of GPS inconsistencies. For example, after the recording, your path may not seem very accurate. If you tap the switch, then after a while (the waiting time depends
                            on the speed of your connection) you will see your path matched on the walking road. Well, as it goes for any automated process, sometimes the result may
                            not be satisfying. Do not worry! You can always return your path to its original condition by turning the switch off (try to do this before saving it, though). This way you will be able
                            to preview your 'matched to road' path and decide if you want to keep it. This switch won't appear in offline mode, but you can always match a saved path
                            when you are back online by modifying it. If you save a 'matched' path, there is no way back, however.
                        </li>
                        <li><i>Discard</i>: The name says it all, it discards the path. A confirmation will appear in case of tapping it by mistake.</li>
                        <li><i>Save</i>: Saves the path! Be sure that it is evaluated</li>
                    </ol>
                </div>
            </div>
            <div className = "faq__item">
                <h6 className="faq__title">
                    What if my internet connection is not very good?
                </h6>
                <div className="faq__text">
                    Good news everyone! This app works offline. You can continue doing your actions, even if the signal is not great (or, inexistent).
                    There are two drawbacks though: Your changes (save, edit, delete) will be visible only after returning to the network. Also, as already mentioned, you won't be able to match your recorded paths
                    when offline.
                </div>
            </div>
            <div className = "faq__item">
                <h5 className="faq__big-title">
                    Drawing a path
                </h5>
                <div className="faq__text">
                    <p>
                        Available at the bottom option 'DRAW'. You can
                    </p>
                    <ol>
                        <li>Draw your path</li>
                        <li>Evaluate your path</li>
                    </ol>
                    <p>(The order can be vice versa)</p>
                    For drawing your path, you should first press the button "Draw".
                    Then, before/during/after the actual 'drawing' action you will have the following toolbar options available:
                    <br/><div className="bg-map_draw_toolbar bg-faq">
                </div><br/>
                    More specifically:
                    <ol>
                        <li>
                            <i>Finish</i>: Finishes your drawing.
                        </li>
                        <li>
                            <i>Delete last point</i>: Removes the last point of your path (last tapped area).
                        </li>
                        <li>
                            <i>Cancel</i>: Cancels everything, the path should no longer exist after this.
                        </li>
                    </ol>
                    <p>
                        <b>Evaluation</b>: <u>Before OR after drawing</u> your path, you can select your path's thickness and color by choosing an option from the available button groups (Evaluation & Features popping Window, it appears after tapping the homonymous button).
                        <i> Please read the info above them</i> to make an accurate evaluation. If you are not able to submit your evaluation, then something is missing (blank name? incomplete evaluation?), make sure that
                        everything necessary is filled/selected and try again!
                        <b className="important-notice"> You will not be able to save your path if no evaluation is submitted.</b>
                    </p>
                    <p>
                        <b>Naming the path</b>:  A default name should appear for every new path. Feel free to change it. But it should not be blank, otherwise you won't be able submit your evaluation.
                    </p>
                    <p>
                        <b>Adding a tag (description)</b>: This is optional. However, we do encourage you to add any further useful information concerning your path.
                    </p>
                    <p>
                        <b>Editing the path:</b> This button just changes <i>the shape</i> of your path. You won't be able to add new points to the polyline (=drawn path). If you are not content with your drawing then you should try the following option.
                    </p>
                    <p>
                        <b>Erasing a path:</b> After tapping the button erase, you can remove the path from the map by tapping it. Also you will have the following toolbar options available:
                    </p>
                        <div className="bg-map_erase_toolbar bg-faq"/>
                    <p>
                        More specifically:
                    </p>
                    <ol>
                        <li>
                            <i>Finish</i>: Finishes your erasure (or non-erasure, whatever you did).
                        </li>
                        <li>
                            <i>Cancel</i>: Cancels erasing actions (nothing happens).
                        </li>
                        <li>
                            <i>Clear all</i>: Clears the map (removes your path from the map).
                        </li>
                    </ol>
                    <p>
                        <b className="important-notice">Please do not confuse 'Erase' with 'Discard'.
                        </b>
                    </p>

                    <p>
                        <b>Discarding the path:</b> It just throws it all away.
                    </p>
                    <p><b>Saving your path</b>: If everything is ready, you should be able to save your path.
                        If the button is not enabled, then something will be missing. Please check all the required fields (no evaluation maybe?) and try again.
                    </p>

                </div>
            </div>
            <div className = "faq__item">
                <h5 className="faq__big-title">
                    My paths (path list)
                </h5>
                <div className="faq__text">
                    <p>This is a full screen window. You can do some actions and then see the result in the map, by tapping this button in the bottom:
                    </p>
                    <div className="bg-menu_collapse bg-faq"/>
                    <p>There, you can see a few statistics (dashboard) of your created paths, your path list, and filtering options.</p>
                    <p>The paths are tappable in this list, so that you can instantly see a few characteristics of each path. </p>
                    <p>There are also  three buttons available for each path: </p>
                    <ol>
                        <li><i>View</i>: Shows the path in the map, with markers at the beginning and the end. The path in the map is tappable also.
                            Tap again this button to hide the path from the map (collapse the 'My paths' screen to see the result).
                        </li>
                        <li><i>Modify</i>: By tapping this button, the window will collapse and you will see your path in the map along with a few editing options available. In this view,
                            the 'Erase' button is not available. If you want to remove a path from the list, you can always delete it. The 'Edit' button will appear only
                            at paths that were created by hand, and the 'Match to roads' switch will appear only at paths that were recorded by GPS. Both options have the same
                            functionality with the 'record' or 'draw' mode accordingly. Last
                            but not least, in order to save a modified path, a change should take place (name? evaluation? match to road? <i>path shape?</i>).
                        </li>
                        <li><i>Delete</i>: The name says it all, it just deletes a path forever. Do not worry, a confirmation will appear in case you tap it by mistake.
                        </li>
                    </ol>
                </div>
            </div>
            <div className = "faq__item">
                <h6 className="faq__title">
                    Show all in the map
                </h6>
                <div className="faq__text">
                    This options selects automatically all the paths in your list and shows them in the map. You can see the results
                    of your selections by collapsing the window with aforementioned the bottom button.
                </div>
            </div>
            <div className = "faq__item">
                <h6 className="faq__title">
                    Filter selections
                </h6>
                <div className="faq__text">
                    Enables the below checkable options, so that you will be able to filter your paths accordingly.
                    They will be selected automatically and then become visible in the map.
                </div>
            </div>
            <div className = "faq__item">
                <h5 className="faq__big-title">
                    Community
                </h5>
                <div className="faq__text">
                    Here you can see the community paths (created by other users).
                    The options are similar to 'My paths'. However, the 'edit' and 'delete' buttons are not available in the path list.
                    Also, you can include (or not) your own paths in this list.
                    If you decide to include your paths in the community list, they will appear with an extra blue line on their left,
                    so that you can distinguish them.
                </div>
            </div>
            <div className = "faq__item">
                <h5 className="faq__big-title">
                    Map
                </h5>
                <div className="faq__text">
                    This options at the top of the app, opens a new window with several map previews. You can select anyone in order to
                    change your map's appearance.
                    You can change the map's style whenever you want. Select a map that suits you best!
                </div>
            </div>
            <div className = "faq__item">
                <h5 className="faq__big-title">
                    Epilogue
                </h5>
                <div className="faq__text">
                    That's all folks. If you managed to reach the bottom of this FAQ, you have the eternal gratitude of the unicorn cat:
                    <br/><div className="bg-unicorn_cat bg-faq">
                </div><br/>
                    <b className="important-notice">
                        Thank you :)
                    </b>
                </div>
            </div>
        </div>
    );
};
