
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.14"
    }
  }
  required_version = ">= 1.0.0"
}

provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile
}

provider "archive" {}

data "archive_file" "zip" {
  type        = "zip"
  source_dir  = "../../functions/api"
  excludes    = ["package-lock.json", "yarn.lock"]
  output_path = "${var.package_name}.zip"
}

data "aws_iam_policy_document" "policy" {
  statement {
    sid     = ""
    effect  = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      identifiers = ["lambda.amazonaws.com"]
      type        = "Service"
    }