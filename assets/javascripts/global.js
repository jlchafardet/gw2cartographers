// Generated by CoffeeScript 1.3.1
(function() {
  var App, AreaSummary, Confirmbox, CustomInfoWindow, CustomMap, Modalbox, att, attToCheck, extractUrlParams, html, _i, _len,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  App = {};

  App.opacity = false;

  App.pointerEvents = false;

  App.localStorageAvailable = (function() {
    if (window['localStorage'] != null) {
      return true;
    } else {
      return false;
    }
  })();

  html = document.documentElement;

  attToCheck = ["pointerEvents", "opacity"];

  for (_i = 0, _len = attToCheck.length; _i < _len; _i++) {
    att = attToCheck[_i];
    if (html.style[att] != null) {
      $(html).addClass(att);
      App[att] = true;
    } else {
      $(html).addClass("no-" + att);
    }
  }

  /*
  # class ModalBox {{{
  */


  Modalbox = (function() {

    Modalbox.name = 'Modalbox';

    function Modalbox() {
      this.close = __bind(this.close, this);
      this.modal = $('<div class="modal"><div class="padding"></div></div>');
      this.overlay = $('<span class="overlay"></span>');
      $('body').append(this.modal);
      $('body').append(this.overlay);
      this.overlay.bind('click', this.close);
    }

    Modalbox.prototype.open = function() {
      this.modal.addClass('visible');
      return this.overlay.addClass('visible');
    };

    Modalbox.prototype.close = function() {
      var t,
        _this = this;
      this.modal.addClass('fadding');
      this.overlay.addClass('fadding');
      return t = setTimeout(function() {
        _this.modal.removeClass('visible fadding');
        return _this.overlay.removeClass('visible fadding');
      }, 150);
    };

    return Modalbox;

  })();

  /*
  #}}}
  */


  /*
  # class Confirmbox {{{
  */


  Confirmbox = (function(_super) {

    __extends(Confirmbox, _super);

    Confirmbox.name = 'Confirmbox';

    function Confirmbox(template) {
      Confirmbox.__super__.constructor.apply(this, arguments);
      this.modal.addClass('confirm-box');
      this.template = template;
    }

    Confirmbox.prototype.initConfirmation = function(contentString, callback) {
      var acceptBtn, confirmBoxContent, confirmMessage, deniedBtn,
        _this = this;
      confirmMessage = {
        confirmMessage: contentString
      };
      confirmBoxContent = $(this.template(confirmMessage));
      acceptBtn = confirmBoxContent.find('#accept');
      deniedBtn = confirmBoxContent.find('#denied');
      this.modal.find('.padding').html(confirmBoxContent);
      acceptBtn.bind('click', function() {
        callback();
        return _this.close();
      });
      deniedBtn.bind('click', this.close);
      return this.open();
    };

    return Confirmbox;

  })(Modalbox);

  /*
  #}}}
  */


  /*
  # classCustomMap {{{
  */


  CustomMap = (function() {

    CustomMap.name = 'CustomMap';

    function CustomMap(id) {
      this.toggleMarkerList = __bind(this.toggleMarkerList, this);

      this.handleEdition = __bind(this.handleEdition, this);

      this.handleExport = __bind(this.handleExport, this);

      this.handleMarkerRemovalTool = __bind(this.handleMarkerRemovalTool, this);

      var markerFormStorage,
        _this = this;
      this.localStorageKey = "gw2c_markers_config_01";
      if (App.localStorageAvailable) {
        markerFormStorage = this.getConfigFromLocalStorage();
        this.MarkersConfig = markerFormStorage ? markerFormStorage : Markers;
      } else {
        this.MarkersConfig = Markers;
      }
      this.blankTilePath = 'tiles/00empty.jpg';
      this.iconsPath = 'assets/images/icons/32x32';
      this.maxZoom = 7;
      this.appState = "read";
      this.html = $('html');
      this.lngContainer = $('#long');
      this.latContainer = $('#lat');
      this.devModInput = $('#dev-mod');
      this.optionsBox = $('#options-box');
      this.addMarkerLink = $('#add-marker');
      this.removeMarkerLink = $('#remove-marker');
      this.markerList = $('#marker-list');
      this.exportBtn = $('#export');
      this.exportWindow = $('#export-windows');
      this.markersOptionsMenu = $('#markers-options');
      this.editionsTools = $('#edition-tools a');
      this.defaultLat = 26.765230565697536;
      this.defaultLng = -36.32080078125;
      this.defaultCat = "generic";
      $.get('assets/javascripts/templates/confirmBox._', function(e) {
        var template;
        template = _.template(e);
        return _this.confirmBox = new Confirmbox(template);
      });
      this.areaSummaryBoxes = [];
      this.editInfowindowTemapl;
      this.canRemoveMarker = false;
      this.draggableMarker = false;
      this.visibleMarkers = true;
      this.canToggleMarkers = true;
      this.currentOpenedInfoWindow = false;
      this.gMapOptions = {
        center: new google.maps.LatLng(this.getStartLat(), this.getStartLng()),
        zoom: 6,
        minZoom: 3,
        maxZoom: this.maxZoom,
        streetViewControl: false,
        mapTypeControl: false,
        mapTypeControlOptions: {
          mapTypeIds: ["custom", google.maps.MapTypeId.ROADMAP]
        },
        panControl: false,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_CENTER,
          zoomControlStyle: google.maps.ZoomControlStyle.SMALL
        }
      };
      this.customMapType = new google.maps.ImageMapType({
        getTileUrl: function(coord, zoom) {
          var normalizedCoord, path;
          normalizedCoord = coord;
          if (normalizedCoord && (normalizedCoord.x < Math.pow(2, zoom)) && (normalizedCoord.x > -1) && (normalizedCoord.y < Math.pow(2, zoom)) && (normalizedCoord.y > -1)) {
            return path = 'tiles/' + zoom + '_' + normalizedCoord.x + '_' + normalizedCoord.y + '.jpg';
          } else {
            return _this.blankTilePath;
          }
        },
        tileSize: new google.maps.Size(256, 256),
        maxZoom: this.maxZoom,
        name: 'GW2 Map'
      });
      this.map = new google.maps.Map($(id)[0], this.gMapOptions);
      this.map.mapTypes.set('custom', this.customMapType);
      this.map.setMapTypeId('custom');
      this.addMenuIcons();
      google.maps.event.addListener(this.map, 'click', function(e) {});
      google.maps.event.addListener(this.map, 'zoom_changed', function(e) {
        var zoomLevel;
        zoomLevel = _this.map.getZoom();
        if (zoomLevel === 4) {
          _this.canToggleMarkers = false;
          _this.hideMarkersOptionsMenu();
          _this.setAllMarkersVisibility(false);
          _this.setAreasInformationVisibility(true);
          if (_this.currentOpenedInfoWindow) {
            return _this.currentOpenedInfoWindow.close();
          }
        } else if (zoomLevel > 4) {
          _this.canToggleMarkers = true;
          _this.showMarkersOptionsMenu();
          _this.setAllMarkersVisibility(true);
          return _this.setAreasInformationVisibility(false);
        } else if (zoomLevel < 4) {
          _this.canToggleMarkers = false;
          _this.hideMarkersOptionsMenu();
          _this.setAllMarkersVisibility(false);
          _this.setAreasInformationVisibility(false);
          if (_this.currentOpenedInfoWindow) {
            return _this.currentOpenedInfoWindow.close();
          }
        }
      });
      this.gMarker = {};
      this.editInfoWindowTemplate = "";
      $.get('assets/javascripts/templates/customInfoWindow._', function(e) {
        _this.editInfoWindowTemplate = _.template(e);
        _this.setAllMarkers();
        _this.initializeAreaSummaryBoxes();
        _this.markerList.find('span').bind('click', function(e) {
          var coord, img, markerType, markerinfo, this_;
          this_ = $(e.currentTarget);
          markerType = this_.attr('data-type');
          coord = _this.map.getCenter();
          markerinfo = {
            "lng": coord.lng(),
            "lat": coord.lat(),
            "title": "--"
          };
          img = "" + _this.iconsPath + "/" + markerType + ".png";
          return _this.addMarkers(markerinfo, img, markerType);
        });
        _this.addMarkerLink.bind('click', _this.toggleMarkerList);
        _this.removeMarkerLink.bind('click', _this.handleMarkerRemovalTool);
        _this.exportBtn.bind('click', _this.handleExport);
        _this.editionsTools.bind('click', _this.handleEdition);
        return _this.exportWindow.find('.close').click(function() {
          return _this.exportWindow.hide();
        });
      });
    }

    CustomMap.prototype.getConfigFromLocalStorage = function() {
      var json;
      json = localStorage.getItem(this.localStorageKey);
      return JSON.parse(json);
    };

    CustomMap.prototype.addMarker = function(markerInfo, markersType, markersCat) {
      var iconmid, iconsize, image, isMarkerDraggable, marker, markerThatMatchUrl, markerType, _j, _len1, _ref, _results,
        _this = this;
      iconsize = 32;
      iconmid = iconsize / 2;
      image = new google.maps.MarkerImage(this.getIconURLByType(markersType, markersCat), null, null, new google.maps.Point(iconmid, iconmid), new google.maps.Size(iconsize, iconsize));
      isMarkerDraggable = markerInfo.draggable != null ? markerInfo.draggable : false;
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(markerInfo.lat, markerInfo.lng),
        map: this.map,
        icon: image,
        visible: markersCat === this.defaultCat ? true : false,
        draggable: isMarkerDraggable,
        cursor: isMarkerDraggable ? "move" : "pointer",
        title: "" + markerInfo.title
      });
      marker["title"] = "" + markerInfo.title;
      marker["desc"] = "" + markerInfo.desc;
      marker["wikiLink"] = "" + markerInfo.wikiLink;
      marker["type"] = "" + markersType;
      marker["cat"] = "" + markersCat;
      markerThatMatchUrl = this.getMarkerByCoordinates(this.getStartLat(), this.getStartLng());
      if (markerThatMatchUrl === markerInfo) {
        marker.infoWindow.open(this.map, marker);
        this.currentOpenedInfoWindow = marker.infoWindow;
      }
      google.maps.event.addListener(marker, 'dragend', function(e) {
        _this.saveToLocalStorage();
        if (marker["infoWindow"] != null) {
          return marker["infoWindow"].updatePos();
        }
      });
      google.maps.event.addListener(marker, 'click', function(e) {
        var closeCurrentInfoWindow, editInfoWindowContent, templateInfo;
        closeCurrentInfoWindow = function() {};
        switch (_this.appState) {
          case "remove":
            return _this.removeMarker(marker.__gm_id, markersType, markersCat);
          case "move":
            if (marker.getDraggable()) {
              marker.setDraggable(false);
              return marker.setCursor("pointer");
            } else {
              marker.setDraggable(true);
              return marker.setCursor("move");
            }
            break;
          default:
            if (marker["infoWindow"] != null) {
              if (_this.currentOpenedInfoWindow === marker["infoWindow"]) {
                return _this.currentOpenedInfoWindow.close();
              } else {
                if (_this.currentOpenedInfoWindow) {
                  _this.currentOpenedInfoWindow.close();
                }
                return marker["infoWindow"].open();
              }
            } else {
              templateInfo = {
                id: marker.__gm_id,
                title: marker.title,
                desc: marker.desc,
                type: marker.type,
                wikiLink: marker.wikiLink
              };
              editInfoWindowContent = _this.editInfoWindowTemplate(templateInfo);
              marker["infoWindow"] = new CustomInfoWindow(marker, editInfoWindowContent, {
                onClose: function() {
                  return _this.currentOpenedInfoWindow = null;
                },
                onOpen: function(infoWindow) {
                  return _this.currentOpenedInfoWindow = infoWindow;
                },
                onSave: function(newInfo) {
                  return _this.updateMarkerInfos(newInfo);
                },
                template: _this.editInfoWindowTemplate
              });
              if (_this.currentOpenedInfoWindow) {
                _this.currentOpenedInfoWindow.close();
              }
              return marker["infoWindow"].open();
            }
        }
      });
      _ref = this.gMarker[markersCat]["markerGroup"];
      _results = [];
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        markerType = _ref[_j];
        if (markerType.slug === markersType) {
          _results.push(markerType["markers"].push(marker));
        }
      }
      return _results;
    };

    CustomMap.prototype.setAllMarkers = function() {
      var key, marker, markerTypeObject, markersCat, markersObjects, newmarkerTypeObject, _ref, _results;
      _ref = this.MarkersConfig;
      _results = [];
      for (markersCat in _ref) {
        markersObjects = _ref[markersCat];
        if (!(this.gMarker[markersCat] != null)) {
          this.gMarker[markersCat] = {};
          this.gMarker[markersCat]["name"] = markersObjects.name;
          this.gMarker[markersCat]["markerGroup"] = [];
        }
        _results.push((function() {
          var _j, _len1, _ref1, _results1;
          _ref1 = markersObjects.markerGroup;
          _results1 = [];
          for (key = _j = 0, _len1 = _ref1.length; _j < _len1; key = ++_j) {
            markerTypeObject = _ref1[key];
            newmarkerTypeObject = {};
            newmarkerTypeObject["name"] = markerTypeObject.name;
            newmarkerTypeObject["slug"] = markerTypeObject.slug;
            newmarkerTypeObject["markers"] = [];
            this.gMarker[markersCat]["markerGroup"].push(newmarkerTypeObject);
            _results1.push((function() {
              var _k, _len2, _ref2, _results2;
              _ref2 = markerTypeObject.markers;
              _results2 = [];
              for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                marker = _ref2[_k];
                _results2.push(this.addMarker(marker, markerTypeObject.slug, markersCat));
              }
              return _results2;
            }).call(this));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    CustomMap.prototype.getIconURLByType = function(type, markersCat) {
      var icon;
      for (icon in Resources.Icons[markersCat]) {
        if (icon === type) {
          return Resources.Icons[markersCat][icon].url;
        }
      }
    };

    CustomMap.prototype.setAllMarkersVisibility = function(isVisible) {
      var cat, markerTypeObject, markersObjects, _ref, _results;
      _ref = this.MarkersConfig;
      _results = [];
      for (cat in _ref) {
        markersObjects = _ref[cat];
        _results.push((function() {
          var _j, _len1, _ref1, _results1;
          _ref1 = markersObjects.markerGroup;
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            markerTypeObject = _ref1[_j];
            if (!$("[data-type='" + markerTypeObject.slug + "']").hasClass('off')) {
              _results1.push(this.setMarkersVisibilityByType(isVisible, markerTypeObject.slug, cat));
            }
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    CustomMap.prototype.setMarkersVisibilityByType = function(isVisible, type, cat) {
      var marker, markerTypeObject, _j, _len1, _ref, _results;
      _ref = this.gMarker[cat]["markerGroup"];
      _results = [];
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        markerTypeObject = _ref[_j];
        if (markerTypeObject.slug === type) {
          _results.push((function() {
            var _k, _len2, _ref1, _results1;
            _ref1 = markerTypeObject.markers;
            _results1 = [];
            for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
              marker = _ref1[_k];
              _results1.push(marker.setVisible(isVisible));
            }
            return _results1;
          })());
        }
      }
      return _results;
    };

    CustomMap.prototype.setMarkersVisibilityByCat = function(isVisible, cat) {
      var marker, markerTypeObject, _j, _len1, _ref, _results;
      _ref = this.gMarker[cat]["markerGroup"];
      _results = [];
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        markerTypeObject = _ref[_j];
        _results.push((function() {
          var _k, _len2, _ref1, _results1;
          _ref1 = markerTypeObject.markers;
          _results1 = [];
          for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
            marker = _ref1[_k];
            _results1.push(marker.setVisible(isVisible));
          }
          return _results1;
        })());
      }
      return _results;
    };

    CustomMap.prototype.handleMarkerRemovalTool = function(e) {
      if (this.removeMarkerLink.hasClass('active')) {
        this.removeMarkerLink.removeClass('active');
        this.optionsBox.removeClass('red');
        return this.canRemoveMarker = false;
      } else {
        this.removeMarkerLink.addClass('active');
        this.optionsBox.addClass('red');
        this.canRemoveMarker = true;
        this.markerList.removeClass('active');
        return this.addMarkerLink.removeClass('active');
      }
    };

    CustomMap.prototype.handleExport = function(e) {
      var exportMarkerObject, jsonString, key, marker, markerTypeObject, markersCat, markersObjects, newmarkerTypeObject, nm, _j, _k, _len1, _len2, _ref, _ref1, _ref2;
      exportMarkerObject = {};
      _ref = this.gMarker;
      for (markersCat in _ref) {
        markersObjects = _ref[markersCat];
        if (!(exportMarkerObject[markersCat] != null)) {
          exportMarkerObject[markersCat] = {};
          exportMarkerObject[markersCat]["name"] = markersObjects.name;
          exportMarkerObject[markersCat]["markerGroup"] = [];
        }
        _ref1 = markersObjects.markerGroup;
        for (key = _j = 0, _len1 = _ref1.length; _j < _len1; key = ++_j) {
          markerTypeObject = _ref1[key];
          newmarkerTypeObject = {};
          newmarkerTypeObject["name"] = markerTypeObject.name;
          newmarkerTypeObject["slug"] = markerTypeObject.slug;
          newmarkerTypeObject["markers"] = [];
          exportMarkerObject[markersCat]["markerGroup"].push(newmarkerTypeObject);
          _ref2 = markerTypeObject.markers;
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            marker = _ref2[_k];
            nm = {
              "lng": marker.getPosition().lng(),
              "lat": marker.getPosition().lat(),
              "title": marker.title,
              "desc": marker.desc,
              "wikiLink": marker.wikiLink
            };
            exportMarkerObject[markersCat]["markerGroup"][key]["markers"].push(nm);
          }
        }
      }
      jsonString = JSON.stringify(exportMarkerObject);
      return jsonString;
    };

    CustomMap.prototype.handleEdition = function(e) {
      var elements, this_, _j, _len1, _ref;
      this_ = $(e.currentTarget);
      _ref = this.editionsTools;
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        elements = _ref[_j];
        if (elements !== e.currentTarget) {
          $(elements).removeClass('active');
        }
      }
      this_.toggleClass('active');
      this.html.removeClass('add remove move send');
      this.appState = "read";
      if (this_.hasClass('active')) {
        this.appState = this_.attr('id');
        this.html.addClass(this_.attr('id'));
      }
      if (this.appState === "read") {
        return this.setDraggableMarker();
      }
    };

    CustomMap.prototype.getStartLat = function() {
      var params;
      params = extractUrlParams();
      if (params['lat'] != null) {
        return params['lat'];
      } else {
        return this.defaultLat;
      }
    };

    CustomMap.prototype.getStartLng = function() {
      var params;
      params = extractUrlParams();
      if (params['lng'] != null) {
        return params['lng'];
      } else {
        return this.defaultLng;
      }
    };

    CustomMap.prototype.removeMarkerFromType = function(mType, mCat) {
      var confirmMessage,
        _this = this;
      confirmMessage = "Delete all «" + mType + "» markers on the map?";
      return this.confirmBox.initConfirmation(confirmMessage, function() {
        var marker, markerKey, markerType, typeKey, _j, _len1, _ref, _results;
        _ref = _this.gMarker[mCat]["markerGroup"];
        _results = [];
        for (typeKey = _j = 0, _len1 = _ref.length; _j < _len1; typeKey = ++_j) {
          markerType = _ref[typeKey];
          if (markerType.slug === mType) {
            _results.push((function() {
              var _k, _len2, _ref1, _results1,
                _this = this;
              _ref1 = markerType.markers;
              _results1 = [];
              for (markerKey = _k = 0, _len2 = _ref1.length; _k < _len2; markerKey = ++_k) {
                marker = _ref1[markerKey];
                marker.setMap(null);
                this.gMarker[mCat]["markerGroup"][typeKey]['markers'] = _.reject(markerType.markers, function(m) {
                  return m === marker;
                });
                _results1.push(this.saveToLocalStorage());
              }
              return _results1;
            }).call(_this));
          }
        }
        return _results;
      });
    };

    CustomMap.prototype.removeMarker = function(id, mType, mCat) {
      var confirmMessage,
        _this = this;
      confirmMessage = "Are you sure you want to delete this marker?";
      return this.confirmBox.initConfirmation(confirmMessage, function() {
        var marker, markerKey, markerType, typeKey, _j, _k, _len1, _len2, _ref, _ref1;
        _ref = _this.gMarker[mCat]["markerGroup"];
        for (typeKey = _j = 0, _len1 = _ref.length; _j < _len1; typeKey = ++_j) {
          markerType = _ref[typeKey];
          if (markerType.slug === mType) {
            _ref1 = markerType.markers;
            for (markerKey = _k = 0, _len2 = _ref1.length; _k < _len2; markerKey = ++_k) {
              marker = _ref1[markerKey];
              if (!(marker.__gm_id === id)) {
                continue;
              }
              marker.setMap(null);
              _this.gMarker[mCat]["markerGroup"][typeKey]['markers'] = _.reject(markerType.markers, function(m) {
                return m === marker;
              });
              _this.saveToLocalStorage();
              return true;
            }
          }
        }
      });
    };

    CustomMap.prototype.updateMarkerInfos = function(newInfo) {
      var marker, markerKey, markerType, typeKey, _j, _k, _len1, _len2, _ref, _ref1;
      _ref = this.gMarker[newInfo.cat]["markerGroup"];
      for (typeKey = _j = 0, _len1 = _ref.length; _j < _len1; typeKey = ++_j) {
        markerType = _ref[typeKey];
        if (markerType.slug === newInfo.type) {
          _ref1 = markerType.markers;
          for (markerKey = _k = 0, _len2 = _ref1.length; _k < _len2; markerKey = ++_k) {
            marker = _ref1[markerKey];
            if (!(marker.__gm_id === newInfo.id)) {
              continue;
            }
            marker.desc = newInfo.desc;
            marker.title = newInfo.title;
            marker.wikiLink = newInfo.wikiLink;
            this.saveToLocalStorage();
            return;
          }
        }
      }
    };

    CustomMap.prototype.saveToLocalStorage = function() {
      var json;
      if (App.localStorageAvailable) {
        json = this.handleExport();
        return localStorage.setItem(this.localStorageKey, json);
      }
    };

    CustomMap.prototype.setDraggableMarker = function(val) {
      var key, marker, markerTypeObject, markersObjects, type, unDrag, _ref, _results;
      unDrag = function(marker) {
        marker.setDraggable(false);
        return marker.setCursor('pointer');
      };
      _ref = this.gMarker;
      _results = [];
      for (type in _ref) {
        markersObjects = _ref[type];
        _results.push((function() {
          var _j, _len1, _ref1, _results1;
          _ref1 = markersObjects.markerGroup;
          _results1 = [];
          for (key = _j = 0, _len1 = _ref1.length; _j < _len1; key = ++_j) {
            markerTypeObject = _ref1[key];
            _results1.push((function() {
              var _k, _len2, _ref2, _results2;
              _ref2 = markerTypeObject.markers;
              _results2 = [];
              for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                marker = _ref2[_k];
                _results2.push(unDrag(marker));
              }
              return _results2;
            })());
          }
          return _results1;
        })());
      }
      return _results;
    };

    CustomMap.prototype.toggleMarkerList = function(e) {
      var this_;
      this_ = $(e.currentTarget);
      this.markerList.toggleClass('active');
      this_.toggleClass('active');
      if (this_.hasClass('active')) {
        this.removeMarkerLink.removeClass('active');
        this.optionsBox.removeClass('red');
        return this.canRemoveMarker = false;
      }
    };

    CustomMap.prototype.getMarkerByCoordinates = function(lat, lng) {
      var key, marker, markerTypeObject, markersObjects, type, _j, _k, _len1, _len2, _ref, _ref1, _ref2;
      _ref = this.MarkersConfig;
      for (type in _ref) {
        markersObjects = _ref[type];
        _ref1 = markersObjects.markerGroup;
        for (key = _j = 0, _len1 = _ref1.length; _j < _len1; key = ++_j) {
          markerTypeObject = _ref1[key];
          _ref2 = markerTypeObject.markers;
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            marker = _ref2[_k];
            if (marker.lat === lat && marker.lng === lng) {
              return marker;
            }
          }
        }
      }
      return false;
    };

    CustomMap.prototype.turnOfMenuIconsFromCat = function(markerCat) {
      var menu;
      menu = $(".menu-marker[data-markerCat='" + markerCat + "']");
      menu.find('.group-toggling').addClass('off');
      return menu.find('.trigger').addClass('off');
    };

    CustomMap.prototype.addMenuIcons = function() {
      var markersOptions,
        _this = this;
      return markersOptions = $.get('assets/javascripts/templates/markersOptions._', function(e) {
        var markerCat, template, _results;
        template = _.template(e);
        html = $(template(Resources));
        html.find(".trigger").bind('click', function(e) {
          var coord, item, markerCat, markerType, myGroupTrigger, newMarkerInfo;
          item = $(e.currentTarget);
          myGroupTrigger = item.closest(".menu-marker").find('.group-toggling');
          markerType = item.attr('data-type');
          markerCat = item.attr('data-cat');
          switch (_this.appState) {
            case "read":
            case "move":
              if (_this.canToggleMarkers) {
                if (item.hasClass('off')) {
                  _this.setMarkersVisibilityByType(true, markerType, markerCat);
                  item.removeClass('off');
                  return myGroupTrigger.removeClass('off');
                } else {
                  _this.setMarkersVisibilityByType(false, markerType, markerCat);
                  return item.addClass('off');
                }
              }
              break;
            case "add":
              coord = _this.map.getCenter();
              newMarkerInfo = {
                desc: "",
                title: "",
                lat: coord.lat(),
                lng: coord.lng(),
                draggable: true
              };
              return _this.addMarker(newMarkerInfo, markerType, markerCat);
            case "remove":
              return _this.removeMarkerFromType(markerType, markerCat);
          }
        });
        html.find('.group-toggling').bind('click', function(e) {
          var markerCat, parent, this_;
          this_ = $(e.currentTarget);
          parent = this_.closest('.menu-marker');
          markerCat = parent.attr('data-markerCat');
          if (this_.hasClass('off')) {
            this_.removeClass('off');
            _this.setMarkersVisibilityByCat(true, markerCat);
            return parent.find('.trigger').removeClass('off');
          } else {
            this_.addClass('off');
            _this.setMarkersVisibilityByCat(false, markerCat);
            return parent.find('.trigger').addClass('off');
          }
        });
        _this.markersOptionsMenu.find('.padding').prepend(html);
        _results = [];
        for (markerCat in _this.MarkersConfig) {
          if (markerCat !== _this.defaultCat) {
            _results.push(_this.turnOfMenuIconsFromCat(markerCat));
          }
        }
        return _results;
      });
    };

    CustomMap.prototype.initializeAreaSummaryBoxes = function() {
      var area, _results;
      _results = [];
      for (area in Areas) {
        _results.push(this.areaSummaryBoxes[area] = new AreaSummary(this.map, Areas[area]));
      }
      return _results;
    };

    CustomMap.prototype.setAreasInformationVisibility = function(isVisible) {
      var box, _j, _len1, _ref, _results;
      _ref = this.areaSummaryBoxes;
      _results = [];
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        box = _ref[_j];
        _results.push(box.setVisible(isVisible));
      }
      return _results;
    };

    CustomMap.prototype.toggleMarkersOptionsMenu = function() {
      return this.markersOptionsMenu.toggleClass('active');
    };

    CustomMap.prototype.hideMarkersOptionsMenu = function() {
      return this.markersOptionsMenu.addClass('off');
    };

    CustomMap.prototype.showMarkersOptionsMenu = function() {
      return this.markersOptionsMenu.removeClass('off');
    };

    return CustomMap;

  })();

  /*
  # }}}
  */


  /*
  # class AreaSummary {{{
  */


  AreaSummary = (function() {

    AreaSummary.name = 'AreaSummary';

    function AreaSummary(map, area) {
      var neBound, swBound,
        _this = this;
      swBound = new google.maps.LatLng(area.swLat, area.swLng);
      neBound = new google.maps.LatLng(area.neLat, area.neLng);
      this.bounds_ = new google.maps.LatLngBounds(swBound, neBound);
      this.area_ = area;
      this.div_ = null;
      this.height_ = 80;
      this.width_ = 150;
      this.template = "";
      $.get('assets/javascripts/templates/areasSummary._', function(e) {
        _this.template = _.template(e);
        return _this.setMap(map);
      });
    }

    AreaSummary.prototype = new google.maps.OverlayView();

    AreaSummary.prototype.onAdd = function() {
      var content, panes;
      content = this.template(this.area_);
      this.div_ = $(content)[0];
      panes = this.getPanes();
      panes.overlayImage.appendChild(this.div_);
      return this.setVisible(false);
    };

    AreaSummary.prototype.draw = function() {
      var div, ne, overlayProjection, sw;
      overlayProjection = this.getProjection();
      sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
      ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
      div = this.div_;
      div.style.left = sw.x + ((ne.x - sw.x) - this.width_) / 2 + 'px';
      return div.style.top = ne.y + ((sw.y - ne.y) - this.height_) / 2 + 'px';
    };

    AreaSummary.prototype.setVisible = function(isVisible) {
      if (this.div_) {
        if (isVisible === true) {
          return this.div_.style.visibility = "visible";
        } else {
          return this.div_.style.visibility = "hidden";
        }
      }
    };

    return AreaSummary;

  })();

  /*
  # }}}
  */


  /*
  # class AreaSummary {{{
  */


  CustomInfoWindow = (function() {

    CustomInfoWindow.name = 'CustomInfoWindow';

    function CustomInfoWindow(marker, content, opts) {
      this.handleSave = __bind(this.handleSave, this);

      this.toggleEditMod = __bind(this.toggleEditMod, this);

      this.open = __bind(this.open, this);

      this.close = __bind(this.close, this);

      var wrap;
      this.content = content;
      this.marker = marker;
      this.template = opts.template;
      this.map = marker.map;
      wrap = "<div class=\"customInfoWindow\">\n  <a href=\"javascript:\" title=\"Close\" class=\"close button\"></a>\n    <div class=\"padding\"></div>\n</div>";
      this.wrap = $(wrap);
      this.closeBtn = this.wrap.find('.close');
      this.setMap(this.map);
      this.isVisible = false;
      this.onClose = opts.onClose;
      this.onOpen = opts.onOpen;
      this.onSave = opts.onSave;
      this.closeBtn.bind('click', this.close);
    }

    CustomInfoWindow.prototype = new google.maps.OverlayView();

    CustomInfoWindow.prototype.onAdd = function() {
      var panes;
      this.wrap.find('.padding').append(this.content);
      this.wrap.css({
        display: "block",
        position: "absolute",
        "min-height": 118
      });
      panes = this.getPanes();
      panes.overlayMouseTarget.appendChild(this.wrap[0]);
      this.iWidth = this.wrap.outerWidth();
      this.iHeight = this.wrap.outerHeight();
      return this.bindButton();
    };

    CustomInfoWindow.prototype.bindButton = function() {
      this.wrap.find('.edit').bind('click', this.toggleEditMod);
      return this.wrap.find('button').bind('click', this.handleSave);
    };

    CustomInfoWindow.prototype.draw = function() {
      var cancelHandler, event, events, overlayProjection, pos, _j, _len1, _results,
        _this = this;
      cancelHandler = function(e) {
        e.cancelBubble = true;
        if (e.stopPropagation) {
          console.log(e.type);
          return e.stopPropagation();
        }
      };
      overlayProjection = this.getProjection();
      pos = overlayProjection.fromLatLngToDivPixel(this.marker.position);
      this.wrap.css({
        left: pos.x + 30,
        top: pos.y - 80
      });
      events = ['mousedown', 'touchstart', 'touchend', 'touchmove', 'contextmenu', 'click'];
      this.listeners = [];
      _results = [];
      for (_j = 0, _len1 = events.length; _j < _len1; _j++) {
        event = events[_j];
        _results.push(this.listeners.push(google.maps.event.addDomListener(this.wrap[0], event, cancelHandler)));
      }
      return _results;
    };

    CustomInfoWindow.prototype.close = function() {
      if (this.wrap) {
        this.onClose(this);
        this.isVisible = false;
        return this.wrap.css({
          display: "none"
        });
      }
    };

    CustomInfoWindow.prototype.open = function() {
      if (this.wrap) {
        this.panMap();
        this.onOpen(this);
        this.isVisible = true;
        return this.wrap.css({
          display: "block"
        });
      }
    };

    CustomInfoWindow.prototype.updatePos = function() {
      var overlayProjection, pos;
      overlayProjection = this.getProjection();
      pos = overlayProjection.fromLatLngToDivPixel(this.marker.position);
      return this.wrap.css({
        left: pos.x + 30,
        top: pos.y - 80
      });
    };

    CustomInfoWindow.prototype.toggleEditMod = function(e) {
      var editBox, markerDescBox, parent, this_;
      this_ = $(e.currentTarget);
      parent = this.wrap;
      markerDescBox = parent.find('.marker-desc');
      editBox = parent.find('.edit-form');
      if (this_.hasClass('active')) {
        markerDescBox.addClass('active');
        this_.removeClass('active');
        return editBox.removeClass('active');
      } else {
        markerDescBox.removeClass('active');
        this_.addClass('active');
        return editBox.addClass('active');
      }
    };

    CustomInfoWindow.prototype.handleSave = function(e) {
      var form, newDesc, newInfo, newTitle, newWikiLink, this_;
      this_ = $(e.currentTarget);
      form = this.wrap.find('.edit-form');
      newTitle = this.wrap.find('[name="marker-title"]').val();
      newDesc = this.wrap.find('[name="marker-description"]').val();
      newWikiLink = this.wrap.find('[name="marker-wiki"]').val();
      form.removeClass('active');
      newInfo = {
        id: this.marker.__gm_id,
        title: newTitle,
        desc: newDesc,
        wikiLink: newWikiLink,
        type: this.marker.type,
        cat: this.marker.cat
      };
      this.wrap.find('.padding').html(this.template(newInfo));
      this.bindButton();
      this.wrap.find('.edit').removeClass('active');
      return this.onSave(newInfo);
    };

    CustomInfoWindow.prototype.panMap = function() {
      return this.map.panTo(new google.maps.LatLng(this.marker.position.lat(), this.marker.position.lng()));
    };

    return CustomInfoWindow;

  })();

  /*
  # }}}
  */


  extractUrlParams = function() {
    var element, f, parameters, x, _j, _len1;
    parameters = location.search.substring(1).split('&');
    f = [];
    for (_j = 0, _len1 = parameters.length; _j < _len1; _j++) {
      element = parameters[_j];
      x = element.split('=');
      f[x[0]] = x[1];
    }
    return f;
  };

  $(function() {
    var markersOptionsMenuToggle, myCustomMap;
    myCustomMap = new CustomMap('#map');
    markersOptionsMenuToggle = $('#options-toggle strong');
    return markersOptionsMenuToggle.click(function() {
      return myCustomMap.toggleMarkersOptionsMenu();
    });
  });

}).call(this);
