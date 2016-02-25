define([], function () {
  return {
    "title": "Campaign",
    "type": "Campaign",
    "properties": {
      "AccountId": {
        "type": "Number",
        "nullable": true,
        "readonly": true,
        "immutable": true
      },
      "NegativeKeywordCount": {
        "type": "Number",
        "filterable": true,
        "nullable": true
      },
      "DeliveryStatus": {
        "type": "String",
        "filterable": true,
        "nullable": true,
        "readonly": true,
        "enum": [
        "CreditCardExpired",
        "IOExceeded",
        "PaymentInformationMissing",
        "InvalidFinancialStatusOther",
        "MigrationPaused",
        "CampaignDeleted",
        "CampaignBudgetPaused",
        "AdGroupExpired",
        "AdGroupDraft",
        "CamAssetRejected",
        "CamAssetDeleted",
        "EditorialRejected",
        "EditorialUnderAppeal",
        "EditorialPending",
        "AssociationDeleted",
        "CampaignUserPaused",
        "AdGroupUserPaused",
        "AdUserPaused",
        "KeywordMatchTypeAdGroupMediumCombinationInvalid",
        "KeywordUserPaused",
        "NegativeKeywordConflicts",
        "BidBelowFirstPageBid",
        "EditorialApprovedLimited",
        "Incomplete",
        "BudgetSuggestions",
        "GeoCodingIncomplete",
        "ProductTargetUserPaused",
        "AdExtensionNotPresent",
        "AdExtensionDeleted",
        "AdExtensionAssociationDeleted",
        "StoreIdNotAssociated",
        "ApplicationNotFound",
        "ApplicationDestinationUrlMismatch",
        "Eligible"
      ]
      },
      "BudgetType": {
        "type": "String",
        "nullable": true,
        "filterable": true,
        "enum": [
        "DivideDailyAcrossMonth",
        "SpendUntilDepleted",
        "DailyTargetWithMonthlyEnforcement"
      ]
      },
      "ConversionTrackingEnabled": {
        "type": "Boolean",
        "filterable": true,
        "nullable": true,
        "i18n": {customValues: true}
      },
      "DailyTargetBudgetAmount": {
        "type": "Number",
        "filterable": true,
        "nullable": true
      },
      "DaylightSaving": {
        "type": "Boolean",
        "filterable": true,
        "nullable": true,
        "mergeEditable": false,
        "i18n": {customValues: true}
      },
      "Description": {
        "type": "String",
        "filterable": true,
        "nullable": false,
        "mergeEditable": false
      },
      "ExcludeFromSyndicatedSearch": {
        "type": "Boolean",
        "nullable": true
      },
      "Id": {
        "type": "Number",
        "id": true,
        "nullable": false,
        "readonly": true
      },
      "MonthlyBudgetAmount": {
        "type": "Number",
        "filterable": true,
        "nullable": true,
        "required": true
      },
      "Name": {
        "type": "String",
        "filterable": true,
        "nullable": false,
        "required": true,
        "aggregateType": "count",
        "i18n": {
          customProperty: true
        }
      },
      "NegativeKeywords": {
        "type": "Object",
        "nullable": false
      },
      "NegativeSiteURLs": {
        "type": "Object",
        "nullable": false
      },
      "SimplifiedBudgetType": {
        "type": "String",
        "nullable": true,
        "enum": [
        "MonthlyBudgetSpendUntilDepleted",
        "DailyBudgetStandard",
        "DailyBudgetAccelerated"
      ]
      },
      "Status": {
        "type": "String",
        "nullable": true,
        "enum": [
        "Active",
        "Deleted",
        "UserPaused",
        "BudgetPaused",
        "BudgetUserPaused"
      ]
      },
      "TimeZone": {
        "type": "String",
        "nullable": true,
        "enum": [
        "Nukualofa",
        "FijiKamchatkaMarshallIsland",
        "AucklandWellington",
        "MagadanSolomonIslandNewCaledonia",
        "Vladivostok",
        "Hobart",
        "GuamPortMoresby",
        "CanberraMelbourneSydney",
        "Brisbane",
        "Darwin",
        "Adelaide",
        "Yakutsk",
        "Seoul",
        "OsakaSapporoTokyo",
        "Taipei",
        "Perth",
        "KualaLumpurSingapore",
        "IrkutskUlaanBataar",
        "BeijingChongqingHongKongUrumqi",
        "Krasnoyarsk",
        "BangkokHanoiJakarta",
        "Rangoon",
        "SriJayawardenepura",
        "AstanaDhaka",
        "Almaty_Novosibirsk",
        "Kathmandu",
        "ChennaiKolkataMumbaiNewDelhi",
        "IslandamabadKarachiTashkent",
        "Ekaterinburg",
        "Kabul",
        "BakuTbilisiYerevan",
        "AbuDhabiMuscat",
        "Tehran",
        "Nairobi",
        "MoscowStPetersburgVolgograd",
        "KuwaitRiyadh",
        "Baghdad",
        "Jerusalem",
        "HelsinkiKyivRigaSofiaTallinnVilnius",
        "HararePretoria",
        "Cairo",
        "Bucharest",
        "AthensIslandanbulMinsk",
        "WestCentralAfrica",
        "SarajevoSkopjeWarsawZagreb",
        "BrusselsCopenhagenMadridParis",
        "BelgradeBratislavaBudapestLjubljanaPrague",
        "AmsterdamBerlinBernRomeStockholmVienna",
        "CasablancaMonrovia",
        "GreenwichMeanTimeDublinEdinburghLisbonLondon",
        "Azores",
        "CapeVerdeIsland",
        "MidAtlantic",
        "Brasilia",
        "BuenosAiresGeorgetown",
        "Greenland",
        "Newfoundland",
        "AtlanticTimeCanada",
        "CaracasLaPaz",
        "Santiago",
        "BogotaLimaQuito",
        "EasternTimeUSCanada",
        "IndianaEast",
        "CentralAmerica",
        "CentralTimeUSCanada",
        "GuadalajaraMexicoCityMonterrey",
        "Saskatchewan",
        "Arizona",
        "ChihuahuaLaPazMazatlan",
        "MountainTime_US_Canada",
        "PacificTimeUSCanadaTijuana",
        "Alaska",
        "Hawaii",
        "MidwayIslandand_Samoa",
        "InternationalDateLineWest"
      ]
      },
      "Timestamp": {
        "type": "DateTime",
        "filterable": true,
        "nullable": false
      }
    }
  };
});
