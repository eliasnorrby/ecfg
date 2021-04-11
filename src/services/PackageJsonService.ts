import fs from 'fs'
import { PackageJson, PackageJsonIO } from '@common/types'

const PKG_JSON = 'package.json'

export class PackageJsonService implements PackageJsonIO {
  read(): PackageJson {
    this.exists()
    return JSON.parse(fs.readFileSync(PKG_JSON, 'utf8'))
  }

  write(content: PackageJson): void {
    fs.writeFileSync(PKG_JSON, JSON.stringify(content, null, 2))
  }

  private exists(): void {
    if (!fs.existsSync(PKG_JSON)) {
      throw new Error(`No ${PKG_JSON} found. Did you run npm init?`)
    }
  }
}
